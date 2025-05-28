"use client";

// Export the component as a properly named function
function NavigationProgressIndicator() {
  // For SSR, we need to make sure we're only rendering on the client
  if (typeof window === 'undefined') {
    return null; // Don't render anything on the server
  }
  
  return (
    <>
      {/* Only render this component when JavaScript is enabled */}
      <div className="js-only">
        <style jsx global>{`
          /* Navigation state styling */
          .navigating .navigation-sensitive {
            opacity: 0.7;
            transition: opacity 0.3s;
            position: relative;
            pointer-events: none;
          }
          
          /* Page loaded state - smooth transition */
          .page-loaded .navigation-sensitive {
            opacity: 1;
            transition: opacity 0.3s ease-in-out;
          }
      
      /* Loading indicator for all pages */
      html.navigating::before {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #4f46e5, #8b5cf6);
        animation: loadingBar 1.5s infinite ease-in-out;
        z-index: 9999;
      }
      
      /* Specific styling for property pages */
      .navigating .properties-content {
        position: relative;
      }
      
      .navigating .properties-content::after {
        content: "";
        position: absolute;
        inset: 0;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(1px);
        z-index: 10;
      }
      
      /* Make sure all navigation-sensitive elements have proper transitions */
      .navigation-sensitive {
        transition: opacity 0.3s;
      }
      
      @keyframes loadingBar {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 0.9; }
      }
    `}</style>
      </div>
    </>
  )
}

// Make sure to export it as default
export default NavigationProgressIndicator;
