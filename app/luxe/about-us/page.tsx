import React from 'react';
import { getLuxeAgentsAction } from '@/actions/agents/get-luxe-agents-action';
import AboutUsClient from './AboutUsClient';
import AboutUsSSR from './AboutUsSSR';

export default async function AboutPage() {
  // Fetch agents data on the server
  const { success, data: agents } = await getLuxeAgentsAction();
  const agentsData = success ? agents : [];

  return (
    <>
      {/* SSR Version - Always renders first for SEO and no-JS users */}
      <div className="ssr-version">
        <AboutUsSSR agents={agentsData} />
      </div>
      
      {/* Client-Side Version - Will hydrate and replace SSR version when JS loads */}
      <div style={{ display: 'none' }} className="js-enhanced">
        <AboutUsClient agents={agentsData} />
      </div>
      
      {/* Script to show enhanced version when JS is available */}
      <script 
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Wait for DOM to be ready
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', switchToClientVersion);
              } else {
                switchToClientVersion();
              }
              
              function switchToClientVersion() {
                try {
                  const ssrElement = document.querySelector('.ssr-version');
                  const jsElement = document.querySelector('.js-enhanced');
                  
                  if (ssrElement && jsElement) {
                    // Hide SSR version
                    ssrElement.style.display = 'none';
                    // Show client version
                    jsElement.style.display = 'block';
                    
                    // Add a class to indicate JS is active
                    document.documentElement.classList.add('js-enabled');
                  }
                } catch (error) {
                  console.warn('Failed to switch to client version:', error);
                  // If anything fails, keep SSR version visible
                }
              }
            })();
          `
        }} 
      />
    </>
  );
}
