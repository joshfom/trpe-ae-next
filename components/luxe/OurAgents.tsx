import LuxeAgentCard from './LuxeAgentCard';
import { getLuxeAgentsAction } from '@/actions/agents/get-luxe-agents-action';

// Helper function to truncate text and remove HTML tags
function truncateAndClean(text: string, maxLength: number = 120): string {
  if (!text) return '';
  
  // Remove HTML tags
  const cleanText = text.replace(/<[^>]*>/g, '');
  
  // Truncate if necessary
  if (cleanText.length <= maxLength) return cleanText;
  
  // Find the last space before the max length to avoid cutting words
  const truncated = cleanText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
}

export async function OurAgents() {
  // Fetch real luxe agents data
  const { success, data: agents } = await getLuxeAgentsAction();
  
  // Take only the first 2 agents for the about-us page
  const displayAgents = success ? agents.slice(0, 2) : [];

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-4 sm:mb-6">
            Our Agents
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Meet our luxury property specialists who are dedicated to providing exceptional service 
            and helping you find your perfect luxury home.
          </p>
        </div>

        {/* Agents Grid - 2 columns, each taking 50% width */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {displayAgents.length > 0 ? (
            displayAgents.map((agent) => (
              <div key={agent.id} className="w-full">
                <LuxeAgentCard
                  name={`${agent.firstName || ''} ${agent.lastName || ''}`.trim()}
                  title={agent.title || 'Luxury Property Specialist'}
                  image={agent.avatarUrl || '/api/placeholder/300/400'}
                  description={truncateAndClean(agent.bio || 'Dedicated to providing exceptional luxury real estate services.')}
                  phone={agent.phone || undefined}
                  email={agent.email || undefined}
                />
              </div>
            ))
          ) : (
            // Fallback if no agents are found
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">Our luxury agents will be available soon.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
