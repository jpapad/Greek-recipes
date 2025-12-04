import { ContactFormBlock as ContactFormBlockType } from '@/lib/types/pages';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ContactFormBlock({ block }: { block: ContactFormBlockType }) {
    return (
        <GlassPanel className="p-4 sm:p-6 md:p-8 my-6">
            {block.data.title && (
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
                    {block.data.title}
                </h2>
            )}
            <form className="space-y-4 sm:space-y-6">
                {block.data.fields.includes('name') && (
                    <div>
                        <Label htmlFor="name" className="text-sm sm:text-base">Όνομα</Label>
                        <Input 
                            id="name" 
                            placeholder="Το όνομά σας" 
                            className="text-sm sm:text-base"
                        />
                    </div>
                )}
                {block.data.fields.includes('email') && (
                    <div>
                        <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                        <Input 
                            id="email" 
                            type="email" 
                            placeholder="email@example.com"
                            className="text-sm sm:text-base"
                        />
                    </div>
                )}
                {block.data.fields.includes('phone') && (
                    <div>
                        <Label htmlFor="phone" className="text-sm sm:text-base">Τηλέφωνο</Label>
                        <Input 
                            id="phone" 
                            type="tel" 
                            placeholder="+30 210 1234567"
                            className="text-sm sm:text-base"
                        />
                    </div>
                )}
                {block.data.fields.includes('message') && (
                    <div>
                        <Label htmlFor="message" className="text-sm sm:text-base">Μήνυμα</Label>
                        <Textarea 
                            id="message" 
                            rows={5} 
                            placeholder="Το μήνυμά σας..."
                            className="text-sm sm:text-base"
                        />
                    </div>
                )}
                <Button type="submit" className="w-full sm:w-auto text-sm sm:text-base">
                    {block.data.submitText || 'Αποστολή'}
                </Button>
            </form>
        </GlassPanel>
    );
}
