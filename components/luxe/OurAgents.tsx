import LuxeAgentCard from './LuxeAgentCard';

interface Agent {
  id: string;
  name: string;
  title: string;
  image: string;
  description: string;
  phone?: string;
  email?: string;
}

export function OurAgents() {
  const agents: Agent[] = [
    {
      id: '1',
      name: 'Micheal Doe',
      title: 'Local Agent',
      image: '/api/placeholder/300/400',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum.',
      phone: '+1 (555) 123-4567',
      email: 'micheal.doe@luxerealestate.com'
    },
    {
      id: '2',
      name: 'Micheal Doe',
      title: 'Local Agent',
      image: '/api/placeholder/300/400',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum.',
      phone: '+1 (555) 123-4568',
      email: 'micheal.doe2@luxerealestate.com'
    },
    {
      id: '3',
      name: 'Micheal Doe',
      title: 'Local Agent',
      image: '/api/placeholder/300/400',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum.',
      phone: '+1 (555) 123-4569',
      email: 'micheal.doe3@luxerealestate.com'
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-4 sm:mb-6">
            Our Agents
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna 
            aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {agents.map((agent) => (
            <div key={agent.id} className="flex justify-center">
              <LuxeAgentCard
                name={agent.name}
                title={agent.title}
                image={agent.image}
                description={agent.description}
                phone={agent.phone}
                email={agent.email}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
