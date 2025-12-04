import { ContactInfoBlock as ContactInfoBlockType } from '@/lib/types/pages';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactInfoBlock({ block }: { block: ContactInfoBlockType }) {
    return (
        <GlassPanel className="p-4 sm:p-6 md:p-8 my-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
                Στοιχεία Επικοινωνίας
            </h2>
            <div className="space-y-3 sm:space-y-4">
                {block.data.email && (
                    <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                        <a 
                            href={`mailto:${block.data.email}`} 
                            className="text-sm sm:text-base hover:text-primary transition-colors break-all"
                        >
                            {block.data.email}
                        </a>
                    </div>
                )}
                {block.data.phone && (
                    <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                        <a 
                            href={`tel:${block.data.phone}`} 
                            className="text-sm sm:text-base hover:text-primary transition-colors"
                        >
                            {block.data.phone}
                        </a>
                    </div>
                )}
                {block.data.address && (
                    <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-1" />
                        <p className="text-sm sm:text-base">{block.data.address}</p>
                    </div>
                )}
                {block.data.socialLinks && block.data.socialLinks.length > 0 && (
                    <div className="flex gap-4 mt-4">
                        {block.data.socialLinks.map((social, index) => (
                            <a
                                key={index}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 transition-colors"
                            >
                                {social.platform}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </GlassPanel>
    );
}
