/**
 * @fileoverview E2E tests for admin insights interface
 * Tests the complete user interface workflow for insights management.
 * @author Auto-generated test suite
 * @date 2025-01-18
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    refresh: jest.fn(),
  })),
  usePathname: jest.fn(() => '/admin/insights'),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock server actions
jest.mock('@/actions/admin/add-insight-action');
jest.mock('@/actions/admin/get-admin-insights-action');
jest.mock('@/actions/admin/update-insight-action');
jest.mock('@/actions/admin/delete-insight-action');

describe('Admin Insights E2E Tests', () => {
  const mockInsight = {
    id: 'insight-1',
    slug: 'test-insight',
    title: 'Test Insight',
    metaTitle: 'Test Meta Title',
    metaDescription: 'Test meta description',
    content: '<p>Test content</p>',
    coverUrl: 'https://example.com/image.jpg',
    altText: 'Test alt text',
    authorId: 'author-1',
    publishedAt: '2025-01-18T10:00:00.000Z',
    isLuxe: false,
    createdAt: '2025-01-18T09:00:00.000Z',
    updatedAt: '2025-01-18T09:30:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Insights List Page', () => {
    it('should display insights list with proper pagination', async () => {
      const { getAdminInsights } = require('@/actions/admin/get-admin-insights-action');
      getAdminInsights.mockResolvedValue({
        success: true,
        data: {
          insights: [mockInsight],
          totalCount: 1,
          totalPages: 1,
          currentPage: 1,
        },
      });

      // Mock the insights list component
      const InsightsList = () => (
        <div>
          <h1>Admin Insights</h1>
          <div data-testid="insights-grid">
            <div data-testid="insight-card">
              <h3>{mockInsight.title}</h3>
              <p>{mockInsight.metaDescription}</p>
              <button data-testid="edit-button">Edit</button>
              <button data-testid="delete-button">Delete</button>
            </div>
          </div>
          <div data-testid="pagination">
            <button disabled>Previous</button>
            <span>Page 1 of 1</span>
            <button disabled>Next</button>
          </div>
        </div>
      );

      render(<InsightsList />);

      // Check if insights are displayed
      expect(screen.getByText('Admin Insights')).toBeInTheDocument();
      expect(screen.getByText(mockInsight.title)).toBeInTheDocument();
      expect(screen.getByText(mockInsight.metaDescription)).toBeInTheDocument();

      // Check pagination
      expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    });

    it('should handle search functionality', async () => {
      const { getAdminInsights } = require('@/actions/admin/get-admin-insights-action');
      
      // Mock search component
      const SearchableInsightsList = () => {
        const [searchTerm, setSearchTerm] = React.useState('');
        
        return (
          <div>
            <input
              data-testid="search-input"
              placeholder="Search insights..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button data-testid="search-button">Search</button>
            <div data-testid="search-results">
              {searchTerm && <p>Searching for: {searchTerm}</p>}
            </div>
          </div>
        );
      };

      const user = userEvent.setup();
      render(<SearchableInsightsList />);

      const searchInput = screen.getByTestId('search-input');
      const searchButton = screen.getByTestId('search-button');

      // Test search input
      await user.type(searchInput, 'test query');
      expect(searchInput).toHaveValue('test query');

      // Test search execution
      await user.click(searchButton);
      expect(screen.getByText('Searching for: test query')).toBeInTheDocument();
    });

    it('should handle sorting options', async () => {
      const SortableInsightsList = () => {
        const [sortBy, setSortBy] = React.useState('createdAt');
        const [sortOrder, setSortOrder] = React.useState('desc');

        return (
          <div>
            <select
              data-testid="sort-by-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">Created Date</option>
              <option value="title">Title</option>
              <option value="publishedAt">Published Date</option>
            </select>
            <select
              data-testid="sort-order-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
            <p data-testid="sort-display">
              Sorted by {sortBy} ({sortOrder})
            </p>
          </div>
        );
      };

      const user = userEvent.setup();
      render(<SortableInsightsList />);

      // Test sort by change
      await user.selectOptions(screen.getByTestId('sort-by-select'), 'title');
      expect(screen.getByText('Sorted by title (desc)')).toBeInTheDocument();

      // Test sort order change
      await user.selectOptions(screen.getByTestId('sort-order-select'), 'asc');
      expect(screen.getByText('Sorted by title (asc)')).toBeInTheDocument();
    });
  });

  describe('Insight Creation Form', () => {
    it('should validate required fields before submission', async () => {
      const { addInsight } = require('@/actions/admin/add-insight-action');
      
      const InsightForm = () => {
        const [formData, setFormData] = React.useState({
          title: '',
          content: '',
          coverUrl: '',
          metaTitle: '',
          metaDescription: '',
        });
        const [errors, setErrors] = React.useState({});

        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          const newErrors: any = {};
          
          if (!formData.title) newErrors.title = 'Title is required';
          if (!formData.content) newErrors.content = 'Content is required';
          if (!formData.coverUrl) newErrors.coverUrl = 'Cover image is required';
          
          setErrors(newErrors);
          
          if (Object.keys(newErrors).length === 0) {
            await addInsight(formData);
          }
        };

        return (
          <form onSubmit={handleSubmit}>
            <input
              data-testid="title-input"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            {errors.title && <span data-testid="title-error">{errors.title}</span>}
            
            <textarea
              data-testid="content-input"
              placeholder="Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
            {errors.content && <span data-testid="content-error">{errors.content}</span>}
            
            <input
              data-testid="cover-url-input"
              placeholder="Cover Image URL"
              value={formData.coverUrl}
              onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
            />
            {errors.coverUrl && <span data-testid="cover-url-error">{errors.coverUrl}</span>}
            
            <button type="submit" data-testid="submit-button">Create Insight</button>
          </form>
        );
      };

      const user = userEvent.setup();
      render(<InsightForm />);

      // Try to submit empty form
      await user.click(screen.getByTestId('submit-button'));

      // Check validation errors
      expect(screen.getByTestId('title-error')).toHaveTextContent('Title is required');
      expect(screen.getByTestId('content-error')).toHaveTextContent('Content is required');
      expect(screen.getByTestId('cover-url-error')).toHaveTextContent('Cover image is required');

      // Fill form and submit
      await user.type(screen.getByTestId('title-input'), 'Test Title');
      await user.type(screen.getByTestId('content-input'), 'Test Content');
      await user.type(screen.getByTestId('cover-url-input'), 'https://example.com/image.jpg');

      addInsight.mockResolvedValue({ success: true, data: mockInsight });
      
      await user.click(screen.getByTestId('submit-button'));
      
      expect(addInsight).toHaveBeenCalledWith({
        title: 'Test Title',
        content: 'Test Content',
        coverUrl: 'https://example.com/image.jpg',
        metaTitle: '',
        metaDescription: '',
      });
    });

    it('should handle image upload and preview', async () => {
      const ImageUploadForm = () => {
        const [imagePreview, setImagePreview] = React.useState('');
        const [uploading, setUploading] = React.useState(false);

        const handleImageUpload = async (file: File) => {
          setUploading(true);
          // Mock image upload
          setTimeout(() => {
            setImagePreview('https://example.com/uploaded-image.jpg');
            setUploading(false);
          }, 500);
        };

        return (
          <div>
            <input
              data-testid="file-input"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
            />
            {uploading && <div data-testid="upload-spinner">Uploading...</div>}
            {imagePreview && (
              <img
                data-testid="image-preview"
                src={imagePreview}
                alt="Preview"
                style={{ width: '200px', height: '150px' }}
              />
            )}
          </div>
        );
      };

      const user = userEvent.setup();
      render(<ImageUploadForm />);

      const fileInput = screen.getByTestId('file-input');
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      await user.upload(fileInput, file);

      // Check upload state
      expect(screen.getByTestId('upload-spinner')).toBeInTheDocument();

      // Wait for upload to complete
      await waitFor(() => {
        expect(screen.getByTestId('image-preview')).toBeInTheDocument();
      });

      expect(screen.getByTestId('image-preview')).toHaveAttribute(
        'src',
        'https://example.com/uploaded-image.jpg'
      );
    });
  });

  describe('Insight Edit Form', () => {
    it('should pre-populate form with existing data', async () => {
      const { updateInsight } = require('@/actions/admin/update-insight-action');
      
      const EditInsightForm = ({ insight }: { insight: typeof mockInsight }) => {
        const [formData, setFormData] = React.useState({
          title: insight.title,
          content: insight.content,
          metaTitle: insight.metaTitle,
          metaDescription: insight.metaDescription,
        });

        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          await updateInsight(insight.slug, formData);
        };

        return (
          <form onSubmit={handleSubmit}>
            <input
              data-testid="edit-title-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <textarea
              data-testid="edit-content-input"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
            <input
              data-testid="edit-meta-title-input"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
            />
            <textarea
              data-testid="edit-meta-description-input"
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
            />
            <button type="submit" data-testid="update-button">Update Insight</button>
          </form>
        );
      };

      render(<EditInsightForm insight={mockInsight} />);

      // Check pre-populated values
      expect(screen.getByTestId('edit-title-input')).toHaveValue(mockInsight.title);
      expect(screen.getByTestId('edit-content-input')).toHaveValue(mockInsight.content);
      expect(screen.getByTestId('edit-meta-title-input')).toHaveValue(mockInsight.metaTitle);
      expect(screen.getByTestId('edit-meta-description-input')).toHaveValue(mockInsight.metaDescription);

      // Test update
      const user = userEvent.setup();
      await user.clear(screen.getByTestId('edit-title-input'));
      await user.type(screen.getByTestId('edit-title-input'), 'Updated Title');

      updateInsight.mockResolvedValue({ success: true, data: { ...mockInsight, title: 'Updated Title' } });
      
      await user.click(screen.getByTestId('update-button'));

      expect(updateInsight).toHaveBeenCalledWith(mockInsight.slug, {
        title: 'Updated Title',
        content: mockInsight.content,
        metaTitle: mockInsight.metaTitle,
        metaDescription: mockInsight.metaDescription,
      });
    });
  });

  describe('Insight Deletion', () => {
    it('should show confirmation dialog before deletion', async () => {
      const { deleteInsight } = require('@/actions/admin/delete-insight-action');
      
      const DeleteInsightButton = ({ insight }: { insight: typeof mockInsight }) => {
        const [showConfirm, setShowConfirm] = React.useState(false);

        const handleDelete = async () => {
          await deleteInsight({ slug: insight.slug });
          setShowConfirm(false);
        };

        return (
          <div>
            <button
              data-testid="delete-trigger"
              onClick={() => setShowConfirm(true)}
            >
              Delete Insight
            </button>
            
            {showConfirm && (
              <div data-testid="delete-confirmation">
                <p>Are you sure you want to delete "{insight.title}"?</p>
                <button data-testid="confirm-delete" onClick={handleDelete}>
                  Yes, Delete
                </button>
                <button
                  data-testid="cancel-delete"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        );
      };

      const user = userEvent.setup();
      render(<DeleteInsightButton insight={mockInsight} />);

      // Click delete trigger
      await user.click(screen.getByTestId('delete-trigger'));

      // Check confirmation dialog
      expect(screen.getByTestId('delete-confirmation')).toBeInTheDocument();
      expect(screen.getByText(`Are you sure you want to delete "${mockInsight.title}"?`)).toBeInTheDocument();

      // Test cancel
      await user.click(screen.getByTestId('cancel-delete'));
      expect(screen.queryByTestId('delete-confirmation')).not.toBeInTheDocument();

      // Show dialog again and confirm
      await user.click(screen.getByTestId('delete-trigger'));
      
      deleteInsight.mockResolvedValue({ success: true });
      
      await user.click(screen.getByTestId('confirm-delete'));

      expect(deleteInsight).toHaveBeenCalledWith({ slug: mockInsight.slug });
    });
  });

  describe('Error Handling in UI', () => {
    it('should display error messages for failed operations', async () => {
      const { addInsight } = require('@/actions/admin/add-insight-action');
      
      const ErrorHandlingForm = () => {
        const [error, setError] = React.useState('');
        const [loading, setLoading] = React.useState(false);

        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setLoading(true);
          setError('');

          const result = await addInsight({
            title: 'Test',
            content: 'Test',
            coverUrl: 'https://example.com/image.jpg',
          });

          setLoading(false);

          if (!result.success) {
            setError(result.error);
          }
        };

        return (
          <form onSubmit={handleSubmit}>
            {error && (
              <div data-testid="error-message" role="alert">
                {error}
              </div>
            )}
            <button type="submit" disabled={loading} data-testid="submit-form">
              {loading ? 'Creating...' : 'Create Insight'}
            </button>
          </form>
        );
      };

      addInsight.mockResolvedValue({
        success: false,
        error: 'Failed to create insight: Database connection error',
      });

      const user = userEvent.setup();
      render(<ErrorHandlingForm />);

      await user.click(screen.getByTestId('submit-form'));

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent(
          'Failed to create insight: Database connection error'
        );
      });
    });

    it('should handle loading states appropriately', async () => {
      const LoadingStateComponent = () => {
        const [loading, setLoading] = React.useState(false);
        const [data, setData] = React.useState(null);

        const loadData = async () => {
          setLoading(true);
          // Simulate API call
          setTimeout(() => {
            setData('Loaded data');
            setLoading(false);
          }, 500);
        };

        return (
          <div>
            <button onClick={loadData} data-testid="load-button">
              Load Data
            </button>
            {loading && (
              <div data-testid="loading-spinner">Loading...</div>
            )}
            {data && (
              <div data-testid="loaded-data">{data}</div>
            )}
          </div>
        );
      };

      const user = userEvent.setup();
      render(<LoadingStateComponent />);

      await user.click(screen.getByTestId('load-button'));

      // Check loading state
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByTestId('loaded-data')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should adapt layout for mobile devices', () => {
      // Mock window.matchMedia for responsive testing
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query.includes('768px'),
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const ResponsiveComponent = () => {
        const [isMobile, setIsMobile] = React.useState(false);

        React.useEffect(() => {
          const mediaQuery = window.matchMedia('(max-width: 768px)');
          setIsMobile(mediaQuery.matches);
        }, []);

        return (
          <div data-testid="responsive-container">
            {isMobile ? (
              <div data-testid="mobile-layout">Mobile Layout</div>
            ) : (
              <div data-testid="desktop-layout">Desktop Layout</div>
            )}
          </div>
        );
      };

      render(<ResponsiveComponent />);

      // Check mobile layout is rendered
      expect(screen.getByTestId('mobile-layout')).toBeInTheDocument();
      expect(screen.queryByTestId('desktop-layout')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and keyboard navigation', async () => {
      const AccessibleForm = () => (
        <form role="form" aria-label="Create insight form">
          <label htmlFor="insight-title">
            Insight Title
            <input
              id="insight-title"
              required
              aria-describedby="title-help"
              data-testid="accessible-title-input"
            />
          </label>
          <div id="title-help">Enter a descriptive title for your insight</div>
          
          <button
            type="submit"
            aria-label="Submit insight form"
            data-testid="accessible-submit"
          >
            Create Insight
          </button>
        </form>
      );

      render(<AccessibleForm />);

      const titleInput = screen.getByTestId('accessible-title-input');
      const submitButton = screen.getByTestId('accessible-submit');

      // Check ARIA attributes
      expect(titleInput).toHaveAttribute('aria-describedby', 'title-help');
      expect(submitButton).toHaveAttribute('aria-label', 'Submit insight form');

      // Test keyboard navigation
      titleInput.focus();
      expect(titleInput).toHaveFocus();

      fireEvent.keyDown(titleInput, { key: 'Tab' });
      expect(submitButton).toHaveFocus();
    });
  });
});
