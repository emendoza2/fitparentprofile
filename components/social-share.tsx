"use client";
import {
  RiFacebookFill,
  RiLinkedinFill,
  RiRedditFill,
  RiTwitterXFill,
  RiWhatsappFill,
} from "react-icons/ri";
import { useEffect, useState } from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  LinkIcon,
  MessageCircle,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "@/hooks/use-toast";

export default function SocialShare() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // Get the current URL only on the client side
    setCurrentUrl(window.location.href);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setIsCopied(true);
      toast({
        title: "Link copied",
        description: "URL copied to clipboard",
        duration: 2000,
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  if (!currentUrl) return null;

  const shareLinks = [
    {
      name: "Twitter",
      icon: <RiTwitterXFill size={18} />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        currentUrl
      )}`,
      color: "hover:text-sky-500",
    },
    {
      name: "Facebook",
      icon: <RiFacebookFill size={18} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        currentUrl
      )}`,
      color: "hover:text-blue-600",
    },
    {
      name: "LinkedIn",
      icon: <RiLinkedinFill size={18} />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        currentUrl
      )}`,
      color: "hover:text-blue-700",
    },
    {
      name: "Reddit",
      icon: <RiRedditFill size={18} />,
      url: `https://www.reddit.com/submit?url=${encodeURIComponent(
        currentUrl
      )}`,
      color: "hover:text-orange-600",
    },
    {
      name: "WhatsApp",
      icon: <RiWhatsappFill size={18} />,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        currentUrl
      )}`,
      color: "hover:text-green-500",
    },
    {
      name: "Email",
      icon: <Mail size={18} />,
      url: `mailto:?body=${encodeURIComponent(currentUrl)}`,
      color: "hover:text-gray-600",
    },
  ];

  return (
    <div className="flex justify-center items-center gap-2">
      {shareLinks.map((link) => (
        <Button
          key={link.name}
          variant="ghost"
          size="icon"
          className={`rounded-full w-9 h-9 ${link.color}`}
          onClick={() => window.open(link.url, "_blank")}
          aria-label={`Share on ${link.name}`}
        >
          {link.icon}
        </Button>
      ))}
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full w-9 h-9 hover:text-violet-600"
        onClick={handleCopyLink}
        aria-label="Copy link"
      >
        <LinkIcon size={18} />
      </Button>
    </div>
  );
}
