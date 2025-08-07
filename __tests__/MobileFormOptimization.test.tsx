import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MobileFormField, MobileForm, MobileTouchButton } from '../MobileFormOptimization';

describe('MobileFormField', () => {
  it('renders text input with floating label', () => {
    render(
      <MobileFormField
        label="Full Name"
        name="fullName"
        type="text"
        placeholder="Enter your full name"
      />
    );

    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'fullName');
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
  });

  it('shows floating label animation on focus', async () => {
    const user = userEvent.setup();
    render(
      <MobileFormField
        label="Email Address"
        name="email"
        type="email"
        placeholder="Enter your email"
      />
    );

    const input = screen.getByRole('textbox');
    const label = screen.getByText('Email Address');

    // Initially label should be in default position
    expect(label).toHaveClass('top-4', 'text-base');

    // Focus input
    await user.click(input);

    await waitFor(() => {
      expect(label).toHaveClass('top-2', 'text-xs', 'text-blue-600');
    });
  });

  it('maintains floating label when input has value', () => {
    render(
      <MobileFormField
        label="Phone Number"
        name="phone"
        type="tel"
        value="+971501234567"
      />
    );

    const label = screen.getByText('Phone Number');
    expect(label).toHaveClass('top-2', 'text-xs');
  });

  it('calls onChange callback when value changes', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();

    render(
      <MobileFormField
        label="Message"
        name="message"
        type="textarea"
        onChange={mockOnChange}
      />
    );

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Hello world');

    expect(mockOnChange).toHaveBeenCalledTimes(11); // Once for each character
    expect(mockOnChange).toHaveBeenLastCalledWith('Hello world');
  });

  it('renders select field with options', () => {
    const options = [
      { value: 'apartment', label: 'Apartment' },
      { value: 'villa', label: 'Villa' },
      { value: 'townhouse', label: 'Townhouse' }
    ];

    render(
      <MobileFormField
        label="Property Type"
        name="propertyType"
        type="select"
        options={options}
        placeholder="Select property type"
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(screen.getByText('Select property type')).toBeInTheDocument();
    expect(screen.getByText('Apartment')).toBeInTheDocument();
    expect(screen.getByText('Villa')).toBeInTheDocument();
    expect(screen.getByText('Townhouse')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(
      <MobileFormField
        label="Email"
        name="email"
        type="email"
        error="Please enter a valid email address"
      />
    );

    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('border-red-300');
  });

  it('shows required indicator for required fields', () => {
    render(
      <MobileFormField
        label="Required Field"
        name="required"
        required={true}
      />
    );

    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('required');
  });

  it('applies correct mobile attributes for different input types', () => {
    const { rerender } = render(
      <MobileFormField
        label="Phone"
        name="phone"
        type="tel"
      />
    );

    let input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('inputMode', 'tel');
    expect(input).toHaveAttribute('autoComplete', 'tel');
    expect(input).toHaveAttribute('pattern', '[0-9]*');

    rerender(
      <MobileFormField
        label="Email"
        name="email"
        type="email"
      />
    );

    input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('inputMode', 'email');
    expect(input).toHaveAttribute('autoComplete', 'email');
  });

  it('has minimum touch target size', () => {
    render(
      <MobileFormField
        label="Touch Target"
        name="touchTarget"
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('min-h-[44px]');
  });

  it('shows focus ring for accessibility', async () => {
    const user = userEvent.setup();
    render(
      <MobileFormField
        label="Focus Test"
        name="focusTest"
      />
    );

    const input = screen.getByRole('textbox');
    await user.click(input);

    const focusRing = input.parentElement?.querySelector('.ring-2');
    expect(focusRing).toHaveClass('ring-blue-500');
  });
});

describe('MobileForm', () => {
  it('renders form with title and description', () => {
    render(
      <MobileForm
        title="Contact Form"
        description="Get in touch with us"
        submitLabel="Send Message"
      >
        <MobileFormField label="Name" name="name" />
      </MobileForm>
    );

    expect(screen.getByText('Contact Form')).toBeInTheDocument();
    expect(screen.getByText('Get in touch with us')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument();
  });

  it('calls onSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = jest.fn((e) => e.preventDefault());

    render(
      <MobileForm onSubmit={mockOnSubmit}>
        <MobileFormField label="Name" name="name" />
      </MobileForm>
    );

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('shows loading state when isSubmitting is true', () => {
    render(
      <MobileForm isSubmitting={true}>
        <MobileFormField label="Name" name="name" />
      </MobileForm>
    );

    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Submitting...')).toBeInTheDocument();
    expect(submitButton).toHaveClass('bg-gray-300', 'cursor-not-allowed');
  });

  it('applies custom className', () => {
    render(
      <MobileForm className="custom-form-class">
        <MobileFormField label="Name" name="name" />
      </MobileForm>
    );

    const formContainer = screen.getByRole('button').closest('.custom-form-class');
    expect(formContainer).toBeInTheDocument();
  });

  it('has proper form structure and accessibility', () => {
    render(
      <MobileForm title="Test Form">
        <MobileFormField label="Name" name="name" />
      </MobileForm>
    );

    const form = screen.getByRole('button').closest('form');
    expect(form).toBeInTheDocument();
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Test Form');
  });
});

describe('MobileTouchButton', () => {
  it('renders button with correct content', () => {
    render(
      <MobileTouchButton onClick={() => {}}>
        Click Me
      </MobileTouchButton>
    );

    const button = screen.getByRole('button', { name: 'Click Me' });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = jest.fn();

    render(
      <MobileTouchButton onClick={mockOnClick}>
        Click Me
      </MobileTouchButton>
    );

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant styles', () => {
    const { rerender } = render(
      <MobileTouchButton variant="primary">
        Primary
      </MobileTouchButton>
    );

    let button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-600', 'text-white');

    rerender(
      <MobileTouchButton variant="secondary">
        Secondary
      </MobileTouchButton>
    );

    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-600', 'text-white');

    rerender(
      <MobileTouchButton variant="outline">
        Outline
      </MobileTouchButton>
    );

    button = screen.getByRole('button');
    expect(button).toHaveClass('border-2', 'border-blue-600', 'text-blue-600');
  });

  it('applies correct size styles', () => {
    const { rerender } = render(
      <MobileTouchButton size="sm">
        Small
      </MobileTouchButton>
    );

    let button = screen.getByRole('button');
    expect(button).toHaveClass('min-h-[36px]', 'text-sm');

    rerender(
      <MobileTouchButton size="md">
        Medium
      </MobileTouchButton>
    );

    button = screen.getByRole('button');
    expect(button).toHaveClass('min-h-[44px]', 'text-base');

    rerender(
      <MobileTouchButton size="lg">
        Large
      </MobileTouchButton>
    );

    button = screen.getByRole('button');
    expect(button).toHaveClass('min-h-[48px]', 'text-lg');
  });

  it('handles disabled state correctly', () => {
    render(
      <MobileTouchButton disabled={true}>
        Disabled
      </MobileTouchButton>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });

  it('has minimum touch target sizes for all sizes', () => {
    const { rerender } = render(
      <MobileTouchButton size="sm">Small</MobileTouchButton>
    );

    let button = screen.getByRole('button');
    expect(button).toHaveClass('min-h-[36px]');

    rerender(<MobileTouchButton size="md">Medium</MobileTouchButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('min-h-[44px]');

    rerender(<MobileTouchButton size="lg">Large</MobileTouchButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('min-h-[48px]');
  });

  it('applies custom className', () => {
    render(
      <MobileTouchButton className="custom-button-class">
        Custom
      </MobileTouchButton>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-button-class');
  });

  it('provides visual feedback on press', () => {
    render(
      <MobileTouchButton>
        Press Me
      </MobileTouchButton>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('active:scale-95');
  });

  it('has proper focus styles for accessibility', () => {
    render(
      <MobileTouchButton>
        Focus Me
      </MobileTouchButton>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-opacity-50');
  });
});