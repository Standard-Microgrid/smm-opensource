"use server"

import { createSupabaseClient } from "@smm/shared/supabase/server"
import { uploadMinigridImage, uploadMinigridDocument } from "@/lib/storage"

export interface CreateMinigridData {
  name: string
  gridCode: string
  location: {
    lat: number | null
    lon: number | null
  }
  gridOverview: string
  powerSystem: {
    providerId: string
    generationCapacityKw: number | null
    storageCapacityKwh: number | null
  }
  meterProviderId: string
  momoProviderId: string
  connectivity: {
    wifiSimNumber: string
    wifiSimNetworkProvider: string
    wifiSimDataPlan: string
    wifiPassword: string
  }
  contacts: Array<{
    id: string
    type: 'Regional Technician' | 'Sales Agent' | 'Local Authority'
    name: string
    phone: string
  }>
  image: File | null
  documents: Array<{
    name: string
    file: File
  }>
}

export interface CreateMinigridResult {
  success: boolean
  gridId?: string
  error?: string
}

export async function createMinigrid(data: CreateMinigridData): Promise<CreateMinigridResult> {
  try {
    const supabase = await createSupabaseClient()
    
    // Get current user's organization and branch IDs
    const { data: userProfile, error: profileError } = await supabase
      .schema('core')
      .from('user_profiles')
      .select('organization_id, branch_id')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .is('deleted_at', null)
      .single()

    if (profileError || !userProfile?.organization_id || !userProfile?.branch_id) {
      return { success: false, error: "User profile not found or no organization/branch assigned" }
    }

    // Server-side validation
    if (!data.name?.trim()) {
      return { success: false, error: "Minigrid name is required" }
    }
    
    if (data.location.lat && (data.location.lat < -90 || data.location.lat > 90)) {
      return { success: false, error: "Invalid latitude. Must be between -90 and 90" }
    }
    
    if (data.location.lon && (data.location.lon < -180 || data.location.lon > 180)) {
      return { success: false, error: "Invalid longitude. Must be between -180 and 180" }
    }
    
    if (data.powerSystem.generationCapacityKw && data.powerSystem.generationCapacityKw < 0) {
      return { success: false, error: "Generation capacity must be a positive number" }
    }
    
    if (data.powerSystem.storageCapacityKwh && data.powerSystem.storageCapacityKwh < 0) {
      return { success: false, error: "Storage capacity must be a positive number" }
    }
    
    if (!data.powerSystem.providerId) {
      return { success: false, error: "Monitoring system provider is required" }
    }
    
    if (!data.meterProviderId) {
      return { success: false, error: "Meter provider is required" }
    }
    
    if (!data.momoProviderId) {
      return { success: false, error: "Mobile money provider is required" }
    }
    
    // Connectivity validation - all fields are optional
    if (data.connectivity.wifiSimNetworkProvider && data.connectivity.wifiSimNetworkProvider.length > 30) {
      return { success: false, error: "WiFi SIM network provider must be 30 characters or less" }
    }
    
    // Contact validation
    if (data.contacts.length > 10) {
      return { success: false, error: "Maximum 10 contacts allowed" }
    }
    
    for (const contact of data.contacts) {
      if (!contact.name?.trim()) {
        return { success: false, error: "All contacts must have a name" }
      }
      if (!contact.phone?.trim()) {
        return { success: false, error: "All contacts must have a phone number" }
      }
      if (!['Regional Technician', 'Sales Agent', 'Local Authority'].includes(contact.type)) {
        return { success: false, error: "Invalid contact type" }
      }
    }
    
    // Validate document labels
    const documentsWithoutLabels = data.documents.filter(doc => !doc.name.trim())
    if (documentsWithoutLabels.length > 0) {
      return { success: false, error: `All documents must have labels. ${documentsWithoutLabels.length} document(s) are missing labels.` }
    }
    
    // Check if grid code already exists
    const { data: existingGrid } = await supabase
      .from('grids')
      .select('id')
      .eq('grid_code', data.gridCode)
      .single()
    
    if (existingGrid) {
      return { success: false, error: "A minigrid with this name already exists. Please choose a different name." }
    }
    
    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50)

    // Create location geometry if coordinates are provided
    let locationGeometry = null
    if (data.location.lat && data.location.lon) {
      locationGeometry = `POINT(${data.location.lon} ${data.location.lat})`
    }

    // Prepare JSONB data
    const wifiData = {
      sim_number: data.connectivity.wifiSimNumber,
      network_provider: data.connectivity.wifiSimNetworkProvider,
      data_plan: data.connectivity.wifiSimDataPlan,
      password: data.connectivity.wifiPassword
    }

    const contactsData = data.contacts.map(contact => ({
      type: contact.type,
      name: contact.name,
      phone: contact.phone
    }))

    // First, create the minigrid record to get the ID
    const { data: gridData, error: gridError } = await supabase
      .from('grids')
      .insert({
        organization_id: userProfile.organization_id,
        branch_id: userProfile.branch_id,
        name: data.name,
        slug: slug,
        grid_code: parseInt(data.gridCode),
        location: locationGeometry,
        notes: data.gridOverview,
        generation_capacity_kw: data.powerSystem.generationCapacityKw,
        storage_capacity_kwh: data.powerSystem.storageCapacityKwh,
        ps_provider_id: data.powerSystem.providerId,
        meter_provider_id: data.meterProviderId,
        momo_provider_id: data.momoProviderId,
        wifi: wifiData,
        contacts: contactsData,
        documents: [] // Will be updated after file uploads
      })
      .select('id')
      .single()

    if (gridError) {
      return {
        success: false,
        error: `Failed to create minigrid: ${gridError.message}`
      }
    }

    const gridId = gridData.id
    const documentsData: Array<{label: string, url: string}> = []

    // Upload image if provided
    let imageUrl: string | undefined
    if (data.image) {
      const imageResult = await uploadMinigridImage(gridId, data.image)
      if (imageResult.success && imageResult.url) {
        imageUrl = imageResult.url
      }
      // Continue without image if upload fails
    }

    // Upload documents
    for (const doc of data.documents) {
      const docResult = await uploadMinigridDocument(gridId, doc.file)
      if (docResult.success && docResult.url) {
        documentsData.push({
          label: doc.name,
          url: docResult.url
        })
      }
      // Continue with other documents if upload fails
    }

    // Update the grid record with file URLs
    const { error: updateError } = await supabase
      .from('grids')
      .update({
        image_url: imageUrl,
        documents: documentsData
      })
      .eq('id', gridId)

    if (updateError) {
      // Don't fail the operation, files are uploaded successfully
    }

    return {
      success: true,
      gridId
    }
  } catch (error) {
    return {
      success: false,
      error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`
    }
  }
}
