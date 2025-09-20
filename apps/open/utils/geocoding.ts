export interface GeocodingResult {
  formatted_address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  components: {
    city?: string;
    country?: string;
    postal_code?: string;
    administrative_area_level_1?: string; // State/Province
  };
}

export async function geocodeLocation(address: string): Promise<GeocodingResult | null> {
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    throw new Error('Google Maps API key not configured');
  }

  const GOOGLE_GEOCODING_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
  
  try {
    const response = await fetch(
      `${GOOGLE_GEOCODING_URL}?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      
      // Extract address components
      const components: {
        city?: string;
        country?: string;
        postal_code?: string;
        administrative_area_level_1?: string;
      } = {};
      result.address_components.forEach((component: {
        types: string[];
        long_name: string;
      }) => {
        const types = component.types;
        if (types.includes('locality')) {
          components.city = component.long_name;
        } else if (types.includes('country')) {
          components.country = component.long_name;
        } else if (types.includes('postal_code')) {
          components.postal_code = component.long_name;
        } else if (types.includes('administrative_area_level_1')) {
          components.administrative_area_level_1 = component.long_name;
        }
      });
      
      return {
        formatted_address: result.formatted_address,
        coordinates: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng
        },
        components
      };
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('Failed to validate location');
  }
}

export async function validateLocation(address: string): Promise<boolean> {
  try {
    const result = await geocodeLocation(address);
    return result !== null;
  } catch {
    return false;
  }
}
