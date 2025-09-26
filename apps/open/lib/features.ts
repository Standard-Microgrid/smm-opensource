// Open source app - Core features only
export const FEATURES = {
    // Core features (open source)
    CUSTOMER_MANAGEMENT: true,
    METER_INTEGRATIONS: true,
    MOMO_PAYMENTS: true,
    GRID_MONITORING: true,
    
    // Proprietary features (disabled in OSS)
    BILLING_MANAGEMENT: false,
    ADVANCED_ANALYTICS: false,
    POWERTIME_REWARDS: false,
    NOTIFICATIONS: false,
    CUSTOM_BRANDING: false,
    INVENTORY_MANAGEMENT: false,
    COMPLIANCE_MANAGEMENT: false,
  } as const;
  
  export type FeatureFlag = keyof typeof FEATURES;
  
  // Helper function to check if a feature is enabled
  export function hasFeature(feature: FeatureFlag): boolean {
    return FEATURES[feature];
  }
  
  // Helper function to show upgrade message for disabled features
  export function getUpgradeMessage(feature: FeatureFlag): string {
    if (FEATURES[feature]) return '';
    
    return `${feature.replace('_', ' ')} is a premium feature. Upgrade to the full platform to access this functionality.`;
  }