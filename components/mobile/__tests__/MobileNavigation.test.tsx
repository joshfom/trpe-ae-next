import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import MobileNavigation, { defaultNavigationItems } from '../MobileNavigation';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe('MobileNavigation', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/');
    // Reset body overflow style
    document.body.style.overflow = 'unset';
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.style.overflow = 'unset';
  });

  const mockNavigationItems = [
    {
      label: 'Home',
      href: '/',
      icon: <span data-testid="home-icon">🏠</span>
    },
    {
      label: 'Properties',
      href: '/properties',
      icon: <span data-testid="properties-icon">🏢</span>,
      children: [
        { label: 'For Sale', href: '/properties/for-sale' },
        { label: 'For Rent', href: '/properties/for-rent' }
      ]
    },
    {
      label: 'Contact',
      href: '/contact',
      icon: <span data-testid="contact-icon">📞</span>
    }
  ];

  it('renders mobile menu button', () => {
    render(<MobileNavigation navigationItems={mockNavigationItems} />);
    
    const menuButton = screen.getByLabelText('Open menu');
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveClass('lg:hidden');
  });

  it('opens and closes menu when button is clicked', async () => {
    render(<MobileNavigation navigationItems={mockNavigationItems} />);
    
    const menuButton = screen.getByLabelText('Open menu');
    
    // Menu should be closed initially
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).toHaveClass('translate-x-full');
    
    // Open menu
    fireEvent.click(menuButton);
    
    await waitFor(() => {
      expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toHaveClass('translate-x-0');
      expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
    });
    
    // Close menu
    const closeButton = screen.getByLabelText('Close menu');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toHaveClass('translate-x-full');
    });
  });

  it('prevents body scroll when menu is open', async () => {
    render(<MobileNavigation navigationItems={mockNavigationItems} />);
    
    const menuButton = screen.getByLabelText('Open menu');
    
    // Open menu
    fireEvent.click(menuButton);
    
    await waitFor(() => {
      expect(document.body.style.overflow).toBe('hidden');
    });
    
    // Close menu
    const closeButton = screen.getByLabelText('Close menu');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(document.body.style.overflow).toBe('unset');
    });
  });

  it('renders navigation items with icons', async () => {
    render(<MobileNavigation navigationItems={mockNavigationItems} />);
    
    // Open menu
    fireEvent.click(screen.getByLabelText('Open menu'));
    
    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Properties')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
      
      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(screen.getByTestId('properties-icon')).toBeInTheDocument();
      expect(screen.getByTestId('contact-icon')).toBeInTheDocument();
    });
  });

  it('expands and collapses submenu items', async () => {
    render(<MobileNavigation navigationItems={mockNavigationItems} />);
    
    // Open menu
    fireEvent.click(screen.getByLabelText('Open menu'));
    
    await waitFor(() => {
      const propertiesButton = screen.getByRole('button', { name: /Properties/ });
      expect(propertiesButton).toHaveAttribute('aria-expanded', 'false');
      
      // Submenu items should not be visible
      expect(screen.queryByText('For Sale')).not.toBeInTheDocument();
      expect(screen.queryByText('For Rent')).not.toBeInTheDocument();
    });
    
    // Expand submenu
    const propertiesButton = screen.getByRole('button', { name: /Properties/ });
    fireEvent.click(propertiesButton);
    
    await waitFor(() => {
      expect(propertiesButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('For Sale')).toBeInTheDocument();
      expect(screen.getByText('For Rent')).toBeInTheDocument();
    });
    
    // Collapse submenu
    fireEvent.click(propertiesButton);
    
    await waitFor(() => {
      expect(propertiesButton).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('For Sale')).not.toBeInTheDocument();
      expect(screen.queryByText('For Rent')).not.toBeInTheDocument();
    });
  });

  it('highlights active navigation item', async () => {
    mockUsePathname.mockReturnValue('/properties/for-sale');
    
    render(<MobileNavigation navigationItems={mockNavigationItems} />);
    
    // Open menu
    fireEvent.click(screen.getByLabelText('Open menu'));
    
    // Expand Properties submenu
    const propertiesButton = screen.getByRole('button', { name: /Properties/ });
    fireEvent.click(propertiesButton);
    
    await waitFor(() => {
      const forSaleLink = screen.getByRole('link', { name: 'For Sale' });
      expect(forSaleLink.closest('div')).toHaveClass('bg-blue-50', 'text-blue-600');
    });
  });

  it('closes menu when overlay is clicked', async () => {
    render(<MobileNavigation navigationItems={mockNavigationItems} />);
    
    // Open menu
    fireEvent.click(screen.getByLabelText('Open menu'));
    
    await waitFor(() => {
      expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toHaveClass('translate-x-0');
    });
    
    // Click overlay
    const overlay = document.querySelector('.bg-black.bg-opacity-50');
    expect(overlay).toBeInTheDocument();
    fireEvent.click(overlay!);
    
    await waitFor(() => {
      expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toHaveClass('translate-x-full');
    });
  });

  it('closes menu when route changes', async () => {
    const { rerender } = render(<MobileNavigation navigationItems={mockNavigationItems} />);
    
    // Open menu
    fireEvent.click(screen.getByLabelText('Open menu'));
    
    await waitFor(() => {
      expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toHaveClass('translate-x-0');
    });
    
    // Simulate route change
    mockUsePathname.mockReturnValue('/properties');
    rerender(<MobileNavigation navigationItems={mockNavigationItems} />);
    
    await waitFor(() => {
      expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toHaveClass('translate-x-full');
    });
  });

  it('calls onNavigate callback when link is clicked', async () => {
    const mockOnNavigate = jest.fn();
    render(
      <MobileNavigation 
        navigationItems={mockNavigationItems} 
        onNavigate={mockOnNavigate}
      />
    );
    
    // Open menu
    fireEvent.click(screen.getByLabelText('Open menu'));
    
    await waitFor(() => {
      const homeLink = screen.getByRole('link', { name: 'Home' });
      fireEvent.click(homeLink);
    });
    
    expect(mockOnNavigate).toHaveBeenCalledWith('/');
  });

  it('applies custom className', () => {
    render(
      <MobileNavigation 
        navigationItems={mockNavigationItems} 
        className="custom-class"
      />
    );
    
    const menuButton = screen.getByLabelText('Open menu');
    expect(menuButton).toHaveClass('custom-class');
  });

  it('renders default navigation items correctly', async () => {
    render(<MobileNavigation navigationItems={defaultNavigationItems} />);
    
    // Open menu
    fireEvent.click(screen.getByLabelText('Open menu'));
    
    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Properties')).toBeInTheDocument();
      expect(screen.getByText('Communities')).toBeInTheDocument();
      expect(screen.getByText('Off-Plan')).toBeInTheDocument();
      expect(screen.getByText('Insights')).toBeInTheDocument();
      expect(screen.getByText('Our Team')).toBeInTheDocument();
      expect(screen.getByText('Contact Us')).toBeInTheDocument();
    });
  });

  it('handles keyboard navigation', async () => {
    render(<MobileNavigation navigationItems={mockNavigationItems} />);
    
    const menuButton = screen.getByLabelText('Open menu');
    
    // Focus and activate with keyboard
    menuButton.focus();
    fireEvent.keyDown(menuButton, { key: 'Enter' });
    
    await waitFor(() => {
      expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toHaveClass('translate-x-0');
    });
  });

  it('maintains accessibility attributes', async () => {
    render(<MobileNavigation navigationItems={mockNavigationItems} />);
    
    // Open menu
    fireEvent.click(screen.getByLabelText('Open menu'));
    
    await waitFor(() => {
      const navigation = screen.getByRole('navigation', { name: 'Mobile navigation' });
      expect(navigation).toBeInTheDocument();
      
      const propertiesButton = screen.getByRole('button', { name: /Properties/ });
      expect(propertiesButton).toHaveAttribute('aria-expanded');
      expect(propertiesButton).toHaveAttribute('aria-controls');
    });
  });
});