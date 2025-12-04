'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  Link as LinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function TiptapEditor({ content, onChange, placeholder = 'Ξεκινήστε να γράφετε...' }: TiptapEditorProps) {
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline hover:text-primary/80',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageDialog(false);
    }
  };

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkDialog(false);
    }
  };

  const ToolbarButton = ({ 
    onClick, 
    active, 
    disabled, 
    icon: Icon, 
    title 
  }: { 
    onClick: () => void; 
    active?: boolean; 
    disabled?: boolean; 
    icon: any; 
    title: string;
  }) => (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      variant={active ? 'default' : 'ghost'}
      size="sm"
      className="h-8 w-8 p-0"
      title={title}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <GlassPanel variant="dark" className="border-b flex flex-wrap gap-1 p-2">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            icon={Bold}
            title="Έντονα (Ctrl+B)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            icon={Italic}
            title="Πλάγια (Ctrl+I)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive('underline')}
            icon={UnderlineIcon}
            title="Υπογράμμιση (Ctrl+U)"
          />
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive('heading', { level: 1 })}
            icon={Heading1}
            title="Τίτλος 1"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            icon={Heading2}
            title="Τίτλος 2"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive('heading', { level: 3 })}
            icon={Heading3}
            title="Τίτλος 3"
          />
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            icon={List}
            title="Λίστα με κουκίδες"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            icon={ListOrdered}
            title="Αριθμημένη λίστα"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
            icon={Quote}
            title="Παράθεση"
          />
        </div>

        {/* Alignment */}
        <div className="flex gap-1 border-r pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            active={editor.isActive({ textAlign: 'left' })}
            icon={AlignLeft}
            title="Στοίχιση αριστερά"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            active={editor.isActive({ textAlign: 'center' })}
            icon={AlignCenter}
            title="Στοίχιση κέντρο"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            active={editor.isActive({ textAlign: 'right' })}
            icon={AlignRight}
            title="Στοίχιση δεξιά"
          />
        </div>

        {/* Media */}
        <div className="flex gap-1 border-r pr-2">
          <ToolbarButton
            onClick={() => setShowImageDialog(true)}
            icon={ImageIcon}
            title="Προσθήκη εικόνας"
          />
          <ToolbarButton
            onClick={() => setShowLinkDialog(true)}
            icon={LinkIcon}
            title="Προσθήκη συνδέσμου"
            active={editor.isActive('link')}
          />
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            icon={Undo}
            title="Αναίρεση (Ctrl+Z)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            icon={Redo}
            title="Επανάληψη (Ctrl+Y)"
          />
        </div>
      </GlassPanel>

      {/* Editor Content */}
      <div className="bg-background">
        <EditorContent editor={editor} />
      </div>

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <GlassPanel className="w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-semibold">Προσθήκη Εικόνας</h3>
            <input
              type="text"
              placeholder="URL εικόνας"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setShowImageDialog(false)}>
                Ακύρωση
              </Button>
              <Button onClick={addImage}>Προσθήκη</Button>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <GlassPanel className="w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-semibold">Προσθήκη Συνδέσμου</h3>
            <input
              type="text"
              placeholder="URL συνδέσμου"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setShowLinkDialog(false)}>
                Ακύρωση
              </Button>
              <Button onClick={addLink}>Προσθήκη</Button>
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
}
