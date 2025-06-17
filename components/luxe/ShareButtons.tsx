import { Facebook, Share2, MessageCircle, Twitter } from 'lucide-react';
import { Insight } from '@/types/insight';

interface ShareButtonsProps {
  insight: Insight;
}

export function ShareButtons({ insight }: ShareButtonsProps) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out this insight: ${insight.title}`;

  const handleShare = (platform: string) => {
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`;
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: insight.title,
            url: currentUrl,
          });
          return;
        }
        // Fallback to copy to clipboard
        navigator.clipboard?.writeText(currentUrl);
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {/* Facebook */}
      <button
        onClick={() => handleShare('facebook')}
        className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>

      {/* WhatsApp */}
      <button
        onClick={() => handleShare('whatsapp')}
        className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>

      {/* Email */}
      <button
        onClick={() => {
          const emailUrl = `mailto:?subject=${encodeURIComponent(insight.title)}&body=${encodeURIComponent(`${shareText} ${currentUrl}`)}`;
          window.location.href = emailUrl;
        }}
        className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
        aria-label="Share via Email"
      >
        <Share2 size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>

      {/* Twitter/X */}
      <button
        onClick={() => handleShare('twitter')}
        className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>
    </div>
  );
}
