import { createSupabaseClient } from "@/lib/supabase-server";
import { getCurrentUserContext } from "@/utils/auth/server-permissions";

// Add this comprehensive test to your debug page
async function debugSupabaseClient() {
    const supabase = await createSupabaseClient();
    
    console.log('=== Supabase Client Debug ===');
    
    // Test 1: Check client configuration
    console.log('Client URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Client Key Length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length);
    
    // Test 2: Test auth status
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('Auth Status:', { 
      hasUser: !!user, 
      userId: user?.id,
      role: user?.role,
      error: authError 
    });
    
    // Test 3: Test different types of queries
    const tests = [];
    
    // Simple select without WHERE
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(1);
      
      tests.push({
        test: 'simple_select',
        success: !error,
        data,
        error: error?.message
      });
    } catch (err) {
      tests.push({
        test: 'simple_select',
        success: false,
        error: err instanceof Error ? err.message : String(err)
      });
    }
    
    // Select with WHERE clause
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', '6ceaf54f-9109-433e-a7a3-b3f9cadf04d3');
      
      tests.push({
        test: 'select_with_where',
        success: !error,
        data,
        error: error?.message
      });
    } catch (err) {
      tests.push({
        test: 'select_with_where', 
        success: false,
        error: err instanceof Error ? err.message : String(err)
      });
    }
    
    // Count query
    try {
      const { count, error } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });
      
      tests.push({
        test: 'count_query',
        success: !error,
        count,
        error: error?.message
      });
    } catch (err) {
      tests.push({
        test: 'count_query',
        success: false, 
        error: err instanceof Error ? err.message : String(err)
      });
    }
    
    // Test other tables to see if it's specific to user_profiles
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .limit(1);
      
      tests.push({
        test: 'organizations_table',
        success: !error,
        data,
        error: error?.message
      });
    } catch (err) {
      tests.push({
        test: 'organizations_table',
        success: false,
        error: err instanceof Error ? err.message : String(err)
      });
    }
    
    return tests;
  }
  
  // Updated debug page component
  export default async function DebugAuthPage() {
    try {
      const supabase = await createSupabaseClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      // Run comprehensive client debug
      const clientDebug = await debugSupabaseClient();
      
      // Test simple table access with core schema
      let tableAccessTest = null;
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .limit(5);
        
        tableAccessTest = {
          success: !error,
          data: data,
          error: error?.message,
          count: data?.length || 0
        };
      } catch (err) {
        tableAccessTest = {
          success: false,
          error: err instanceof Error ? err.message : String(err)
        };
      }
      
      // Your existing tests...
      let userContext = null;
      let userContextError = null;
      try {
        userContext = await getCurrentUserContext();
      } catch (error) {
        userContextError = error;
      }
      
      return (
        <div className="p-8 bg-white text-black min-h-screen">
          <h1 className="text-2xl font-bold mb-4 text-black">Authentication Debug</h1>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-black">Table Access Test (RLS Disabled):</h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto text-black">
                {JSON.stringify(tableAccessTest, null, 2)}
              </pre>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black">Supabase Client Debug:</h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto text-black">
                {JSON.stringify(clientDebug, null, 2)}
              </pre>
            </div>
  
            <div>
              <h2 className="text-lg font-semibold text-black">Raw Supabase User:</h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto text-black">
                {JSON.stringify({ user, error: userError }, null, 2)}
              </pre>
            </div>
  
            <div>
              <h2 className="text-lg font-semibold text-black">User Context:</h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto text-black">
                {JSON.stringify(userContext, null, 2)}
              </pre>
              {userContextError ? (
                <div>
                  <h3 className="text-md font-semibold text-red-600">User Context Error:</h3>
                  <pre className="bg-red-100 p-4 rounded text-sm overflow-auto text-black">
                    {userContextError instanceof Error ? userContextError.message : String(userContextError)}
                  </pre>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      );
    } catch (error) {
      return (
        <div className="p-8 bg-white text-black min-h-screen">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Authentication Error</h1>
          <pre className="bg-red-100 p-4 rounded text-sm overflow-auto text-black">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      );
    }
  }