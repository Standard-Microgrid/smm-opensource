"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getProviders } from "@/app/actions/providers"
import { createMinigrid } from "@/app/actions/minigrids"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Textarea,
} from "@smm/ui-core"
import { 
  Zap,
  Info,
  CircleGauge,
  Smartphone,
  FileText,
  Wifi,
  Plus,
  UserRound,
  CircleX
} from "lucide-react"
import { ImageUpload } from "@/components/image-upload"
import { LocationPicker } from "@/components/location-picker"
import { PhoneInput } from "@/components/ui/phone-input"

// Providers are now fetched from the database in useEffect

interface Contact {
  id: string
  type: 'Regional Technician' | 'Sales Agent' | 'Local Authority'
  name: string
  phone: string
}

interface FormData {
  name: string
  image: File | null
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
  meterProvider: {
    providerId: string
  }
  momoProvider: {
    providerId: string
  }
  connectivity: {
    wifiSimNumber: string
    wifiSimNetworkProvider: string
    wifiSimDataPlan: string
    wifiPassword: string
  }
  contacts: Contact[]
  documents: Array<{
    name: string
    file: File
  }>
}

export default function NewMinigridPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [psProviders, setPsProviders] = useState<Array<{ id: string; provider_name: string }>>([])
  const [meterProviders, setMeterProviders] = useState<Array<{ id: string; name: string }>>([])
  const [momoProviders, setMomoProviders] = useState<Array<{ id: string; name: string }>>([])
  const [isLoadingProviders, setIsLoadingProviders] = useState(true)

  const [formData, setFormData] = useState<FormData>({
    name: "",
    image: null,
    location: {
      lat: null,
      lon: null,
    },
    gridOverview: "",
    powerSystem: {
      providerId: "",
      generationCapacityKw: null,
      storageCapacityKwh: null,
    },
    meterProvider: {
      providerId: "",
    },
    momoProvider: {
      providerId: "",
    },
    connectivity: {
      wifiSimNumber: "",
      wifiSimNetworkProvider: "",
      wifiSimDataPlan: "",
      wifiPassword: "",
    },
    contacts: [],
    documents: [],
  })

  // Fetch providers from database using server action
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const result = await getProviders()
        
        if (result.success) {
          setPsProviders(result.psProviders)
          setMeterProviders(result.meterProviders)
          setMomoProviders(result.momoProviders)
        } else {
          console.error('Error fetching providers:', result.error)
        }
      } catch (error) {
        console.error('Error fetching providers:', error)
      } finally {
        setIsLoadingProviders(false)
      }
    }

    fetchProviders()
  }, [])

  const handleDocumentDrop = (files: File[]) => {
    const maxFileSize = 2 * 1024 * 1024; // 2MB per file
    const maxFiles = 10;
    
    // Validate files
    const validFiles: File[] = [];
    const errors: string[] = [];
    
    files.forEach((file) => {
      if (file.size > maxFileSize) {
        errors.push(`${file.name}: File size must be less than 2MB`);
      } else if (file.type !== 'application/pdf') {
        errors.push(`${file.name}: Only PDF files are allowed`);
      } else {
        validFiles.push(file);
      }
    });
    
    if (errors.length > 0) {
      // Document validation errors - could show to user if needed
    }
    
    // Check total file limit
    const currentCount = formData.documents.length;
    const newCount = validFiles.length;
    if (currentCount + newCount > maxFiles) {
      return; // Maximum file limit reached
    }
    
    const newDocuments = validFiles.map(file => ({
      name: "", // Start with empty label
      file,
    }))
    
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...newDocuments]
    }))
  }

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }))
  }

  const addContact = () => {
    if (formData.contacts.length >= 10) {
      return // Maximum 10 contacts
    }
    
    const newContact: Contact = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'Regional Technician',
      name: '',
      phone: ''
    }
    
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, newContact]
    }))
  }

  const removeContact = (contactId: string) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.filter(contact => contact.id !== contactId)
    }))
  }

  const updateContact = (contactId: string, field: keyof Contact, value: string) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.map(contact =>
        contact.id === contactId ? { ...contact, [field]: value } : contact
      )
    }))
  }

  const generateGridCode = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 20)
  }

  const isFormValid = () => {
    // Check required fields
    if (!formData.name.trim()) return false
    if (!formData.powerSystem.providerId) return false
    if (!formData.meterProvider.providerId) return false
    if (!formData.momoProvider.providerId) return false
    
    // Check contact validation (if contacts exist)
    for (const contact of formData.contacts) {
      if (!contact.name.trim() || !contact.phone.trim()) return false
    }
    
    // Check document validation (if documents exist)
    for (const doc of formData.documents) {
      if (!doc.name.trim()) return false
    }
    
    return true
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }
    
    if (!formData.powerSystem.providerId) {
      errors.psProvider = "Monitoring system provider is required"
    }
    
    if (!formData.meterProvider.providerId) {
      errors.meterProvider = "Meter provider is required"
    }
    
    if (!formData.momoProvider.providerId) {
      errors.momoProvider = "Mobile money provider is required"
    }
    
    if (formData.powerSystem.generationCapacityKw && formData.powerSystem.generationCapacityKw < 0) {
      errors.generationCapacity = "Generation capacity must be positive"
    }
    
    if (formData.powerSystem.storageCapacityKwh && formData.powerSystem.storageCapacityKwh < 0) {
      errors.storageCapacity = "Storage capacity must be positive"
    }
    
    // Connectivity validation - all fields are optional
    
    // Contact validation
    formData.contacts.forEach((contact, index) => {
      if (!contact.name.trim()) {
        errors[`contact_${index}_name`] = "Contact name is required"
      }
      if (!contact.phone.trim()) {
        errors[`contact_${index}_phone`] = "Contact phone is required"
      }
    })
    
    const documentsWithoutLabels = formData.documents.filter(doc => !doc.name.trim())
    if (documentsWithoutLabels.length > 0) {
      errors.documents = `${documentsWithoutLabels.length} document(s) are missing labels`
    }
    
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const result = await createMinigrid({
        name: formData.name,
        gridCode: generateGridCode(formData.name),
        location: formData.location,
        gridOverview: formData.gridOverview,
        powerSystem: formData.powerSystem,
        meterProviderId: formData.meterProvider.providerId,
        momoProviderId: formData.momoProvider.providerId,
        connectivity: formData.connectivity,
        contacts: formData.contacts,
        image: formData.image,
        documents: formData.documents
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.success) {
        // Small delay to show completion
        setTimeout(() => {
          router.push('/minigrids')
        }, 500)
      } else {
        setError(result.error || 'Failed to create minigrid')
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/minigrids">Minigrids</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Add Minigrid</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        </div>
      </header>
      
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">

        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md">
            <p className="text-sm font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Upload Progress */}
        {isSubmitting && uploadProgress > 0 && (
          <div className="bg-primary/10 border border-primary/20 text-primary px-4 py-3 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Creating minigrid...</p>
              <p className="text-sm">{uploadProgress}%</p>
            </div>
            <div className="w-full bg-primary/20 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-w-md">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter minigrid name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, name: e.target.value }))
                    if (fieldErrors.name) {
                      setFieldErrors(prev => ({ ...prev, name: "" }))
                    }
                  }}
                  required
                  className={fieldErrors.name ? "border-destructive" : ""}
                />
                {fieldErrors.name && (
                  <p className="text-sm text-destructive">{fieldErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Grid Image</Label>
                <ImageUpload
                  onFileChange={React.useCallback((file: File | null) => {
                    setFormData(prev => ({ ...prev, image: file }));
                  }, [])}
                  accept="image/*"
                  maxSize={10 * 1024 * 1024} // 10MB (will be compressed to ~500KB)
                />
              </div>

              <div className="space-y-2 max-w-md">
                <Label>Location</Label>
                <LocationPicker
                  latitude={formData.location.lat}
                  longitude={formData.location.lon}
                  onLocationChange={(lat, lon) => setFormData(prev => ({
                    ...prev,
                    location: { lat, lon }
                  }))}
                />
              </div>

              <div className="space-y-2 max-w-2xl">
                <Label htmlFor="gridOverview">Grid Overview</Label>
                <Textarea
                  id="gridOverview"
                  placeholder="Describe the minigrid and any important notes..."
                  value={formData.gridOverview}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, gridOverview: e.target.value }))}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Power System Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Power System Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-w-md">
                <Label htmlFor="psProvider">Monitoring System Provider *</Label>
                <Select
                  value={formData.powerSystem.providerId}
                  onValueChange={(value) => {
                    setFormData(prev => ({
                      ...prev,
                      powerSystem: { ...prev.powerSystem, providerId: value }
                    }))
                    if (fieldErrors.psProvider) {
                      setFieldErrors(prev => ({ ...prev, psProvider: "" }))
                    }
                  }}
                >
                  <SelectTrigger className={fieldErrors.psProvider ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select a monitoring system provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingProviders ? (
                      <SelectItem value="loading" disabled>
                        Loading providers...
                      </SelectItem>
                    ) : psProviders.length === 0 ? (
                      <SelectItem value="no-data" disabled>
                        No providers found
                      </SelectItem>
                    ) : (
                      psProviders.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.provider_name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {fieldErrors.psProvider && (
                  <p className="text-sm text-destructive">{fieldErrors.psProvider}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="generationCapacity">Generation Capacity (kW)</Label>
                  <Input
                    id="generationCapacity"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g., 14.0"
                    value={formData.powerSystem.generationCapacityKw || ""}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        powerSystem: { 
                          ...prev.powerSystem, 
                          generationCapacityKw: parseFloat(e.target.value) || null 
                        }
                      }))
                      if (fieldErrors.generationCapacity) {
                        setFieldErrors(prev => ({ ...prev, generationCapacity: "" }))
                      }
                    }}
                    className={fieldErrors.generationCapacity ? "border-destructive" : ""}
                  />
                  {fieldErrors.generationCapacity && (
                    <p className="text-sm text-destructive">{fieldErrors.generationCapacity}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storageCapacity">Storage Capacity (kWh)</Label>
                  <Input
                    id="storageCapacity"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g., 30.0"
                    value={formData.powerSystem.storageCapacityKwh || ""}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        powerSystem: { 
                          ...prev.powerSystem, 
                          storageCapacityKwh: parseFloat(e.target.value) || null 
                        }
                      }))
                      if (fieldErrors.storageCapacity) {
                        setFieldErrors(prev => ({ ...prev, storageCapacity: "" }))
                      }
                    }}
                    className={fieldErrors.storageCapacity ? "border-destructive" : ""}
                  />
                  {fieldErrors.storageCapacity && (
                    <p className="text-sm text-destructive">{fieldErrors.storageCapacity}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connectivity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                Connectivity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-w-md">
                <Label htmlFor="wifiSimNumber">WiFi SIM #</Label>
                <PhoneInput
                  value={formData.connectivity.wifiSimNumber}
                  onChange={(value) => {
                    setFormData(prev => ({
                      ...prev,
                      connectivity: { ...prev.connectivity, wifiSimNumber: value }
                    }))
                  }}
                  placeholder="Enter WiFi SIM number"
                />
              </div>

              <div className="space-y-2 max-w-md">
                <Label htmlFor="wifiSimNetworkProvider">WiFi SIM Network Provider</Label>
                <Input
                  id="wifiSimNetworkProvider"
                  placeholder="Enter network provider"
                  value={formData.connectivity.wifiSimNetworkProvider}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      connectivity: { 
                        ...prev.connectivity, 
                        wifiSimNetworkProvider: e.target.value.slice(0, 30) // 30 character limit
                      }
                    }))
                  }}
                  maxLength={30}
                />
              </div>

              <div className="space-y-2 max-w-md">
                <Label htmlFor="wifiSimDataPlan">WiFi SIM Data Plan</Label>
                <Input
                  id="wifiSimDataPlan"
                  placeholder="Enter data plan details"
                  value={formData.connectivity.wifiSimDataPlan}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      connectivity: { ...prev.connectivity, wifiSimDataPlan: e.target.value }
                    }))
                  }}
                />
              </div>

              <div className="space-y-2 max-w-md">
                <Label htmlFor="wifiPassword">WiFi Password</Label>
                <Input
                  id="wifiPassword"
                  type="password"
                  placeholder="Enter WiFi password"
                  value={formData.connectivity.wifiPassword}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      connectivity: { ...prev.connectivity, wifiPassword: e.target.value }
                    }))
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Meter Provider */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CircleGauge className="h-5 w-5" />
                Meter Provider
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-w-md">
                <Label htmlFor="meterProvider">Meter Provider *</Label>
                <Select
                  value={formData.meterProvider.providerId}
                  onValueChange={(value) => {
                    setFormData(prev => ({
                      ...prev,
                      meterProvider: { providerId: value }
                    }))
                    if (fieldErrors.meterProvider) {
                      setFieldErrors(prev => ({ ...prev, meterProvider: "" }))
                    }
                  }}
                >
                  <SelectTrigger className={fieldErrors.meterProvider ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select a meter provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingProviders ? (
                      <SelectItem value="loading" disabled>
                        Loading providers...
                      </SelectItem>
                    ) : (
                      meterProviders.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {fieldErrors.meterProvider && (
                  <p className="text-sm text-destructive">{fieldErrors.meterProvider}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Additional configuration fields will appear based on your selection
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Money Provider */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Mobile Money Provider
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-w-md">
                <Label htmlFor="momoProvider">Mobile Money Provider *</Label>
                <Select
                  value={formData.momoProvider.providerId}
                  onValueChange={(value) => {
                    setFormData(prev => ({
                      ...prev,
                      momoProvider: { providerId: value }
                    }))
                    if (fieldErrors.momoProvider) {
                      setFieldErrors(prev => ({ ...prev, momoProvider: "" }))
                    }
                  }}
                >
                  <SelectTrigger className={fieldErrors.momoProvider ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select a mobile money provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingProviders ? (
                      <SelectItem value="loading" disabled>
                        Loading providers...
                      </SelectItem>
                    ) : (
                      momoProviders.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {fieldErrors.momoProvider && (
                  <p className="text-sm text-destructive">{fieldErrors.momoProvider}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Additional configuration fields will appear based on your selection
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Local Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="h-5 w-5" />
                Local Contacts
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Add up to 10 local contacts for this minigrid
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.contacts.map((contact, index) => (
                <div key={contact.id} className="border rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`contact-${contact.id}-type`}>Contact Type</Label>
                      <Select
                        value={contact.type}
                        onValueChange={(value: 'Regional Technician' | 'Sales Agent' | 'Local Authority') => 
                          updateContact(contact.id, 'type', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Regional Technician">Regional Technician</SelectItem>
                          <SelectItem value="Sales Agent">Sales Agent</SelectItem>
                          <SelectItem value="Local Authority">Local Authority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`contact-${contact.id}-name`}>Name *</Label>
                      <Input
                        id={`contact-${contact.id}-name`}
                        placeholder="Enter contact name"
                        value={contact.name}
                        onChange={(e) => {
                          updateContact(contact.id, 'name', e.target.value)
                          if (fieldErrors[`contact_${index}_name`]) {
                            setFieldErrors(prev => ({ ...prev, [`contact_${index}_name`]: "" }))
                          }
                        }}
                        className={fieldErrors[`contact_${index}_name`] ? "border-destructive" : ""}
                      />
                      {fieldErrors[`contact_${index}_name`] && (
                        <p className="text-sm text-destructive">{fieldErrors[`contact_${index}_name`]}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`contact-${contact.id}-phone`}>Phone *</Label>
                      <div className="flex items-center gap-2">
                        <PhoneInput
                          value={contact.phone}
                          onChange={(value) => {
                            updateContact(contact.id, 'phone', value)
                            if (fieldErrors[`contact_${index}_phone`]) {
                              setFieldErrors(prev => ({ ...prev, [`contact_${index}_phone`]: "" }))
                            }
                          }}
                          placeholder="Enter phone number"
                          className={fieldErrors[`contact_${index}_phone`] ? "border-destructive" : ""}
                        />
                        <button
                          type="button"
                          onClick={() => removeContact(contact.id)}
                          className="text-destructive hover:text-destructive-foreground p-1 rounded-full hover:bg-destructive/10 transition-colors"
                        >
                          <CircleX className="h-4 w-4" />
                        </button>
                      </div>
                      {fieldErrors[`contact_${index}_phone`] && (
                        <p className="text-sm text-destructive">{fieldErrors[`contact_${index}_phone`]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addContact}
                  disabled={formData.contacts.length >= 10}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {formData.contacts.length >= 10 ? "Maximum 10 contacts reached" : "Contact(s)"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Site Documentation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Site Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-w-2xl">
                <Label>Upload Documents</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  <div className="text-center">
                    <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium mb-1">Upload PDF documents</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Maximum 2MB per file, up to 10 files
                    </p>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 0) {
                          handleDocumentDrop(files);
                        }
                      }}
                      className="hidden"
                      id="document-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('document-upload')?.click()}
                    >
                      Choose Files
                    </Button>
                  </div>
                </div>
              </div>

              {fieldErrors.documents && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-3 py-2 rounded-md">
                  <p className="text-sm">{fieldErrors.documents}</p>
                </div>
              )}

              {formData.documents.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Documents</Label>
                  <div className="space-y-2">
                    {formData.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-3 flex-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div className="w-[240px]">
                            <Input
                              value={doc.name}
                              onChange={(e) => {
                                const newDocs = [...formData.documents]
                                newDocs[index].name = e.target.value.slice(0, 30) // Limit to 30 characters
                                setFormData(prev => ({ ...prev, documents: newDocs }))
                              }}
                              placeholder="Enter document label (required)"
                              className="h-8"
                              maxLength={30}
                              required
                            />
                          </div>
                          <div className="text-sm text-muted-foreground min-w-0 flex-shrink-0">
                            <span className="truncate block max-w-[200px]" title={doc.file.name}>
                              {doc.file.name}
                            </span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(index)}
                          className="ml-2"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/minigrids")}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !isFormValid()} 
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {uploadProgress === 100 ? "Finalizing..." : "Creating..."}
                </>
              ) : (
                "Create Minigrid"
              )}
            </Button>
          </div>
        </form>
      </div>
    </SidebarInset>
  )
}
