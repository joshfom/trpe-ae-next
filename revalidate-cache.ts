import { revalidateTag } from 'next/cache';

export async function revalidateLuxeCache() {
  try {
    console.log('🔄 Revalidating luxe insights cache...');
    
    // Revalidate the cache tags used by the luxe insights actions
    revalidateTag('luxe-insights');
    revalidateTag('luxe-insights-list'); 
    revalidateTag('luxe-insight-by-slug');
    
    console.log('✅ Cache revalidated successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error revalidating cache:', error);
    return { success: false, error };
  }
}

// Call it immediately
revalidateLuxeCache();
