"use client"
import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import CharacterCount from '@tiptap/extension-character-count'
import { useState, useCallback, useEffect, useMemo, memo } from 'react'
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Quote,
    Undo,
    Redo,
    Strikethrough,
    Underline as UnderlineIcon,
    Link as LinkIcon,
    ChevronDown,
} from 'lucide-react'
import { useController, type Control } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

const headingOptions = [
    { label: 'Paragraph', value: 'paragraph' },
    { label: 'Heading 2', value: 'h2' },
    { label: 'Heading 3', value: 'h3' },
    { label: 'Heading 4', value: 'h4' },
    { label: 'Heading 5', value: 'h5' },
]

interface ToolbarButtonProps {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    children: React.ReactNode
    className?: string
}

const ToolbarButton = memo<ToolbarButtonProps>(({
                           onClick,
                           isActive,
                           disabled,
                           children,
                           className,
                       }) => (
    <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClick}
        disabled={disabled}
        className={cn(
            'h-8 w-8 p-0',
            isActive && 'bg-muted hover:bg-muted',
            className
        )}
    >
        {children}
    </Button>
));

ToolbarButton.displayName = 'ToolbarButton';

interface MenuBarProps {
    editor: Editor | null
}

const MenuBar = memo<MenuBarProps>(({ editor }) => {
    const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false)
    const [linkUrl, setLinkUrl] = useState('')
    const [linkStatus, setLinkStatus] = useState<string>('')

    // Update link URL when popover opens
    useEffect(() => {
        if (isLinkPopoverOpen && editor) {
            const linkAttributes = editor.getAttributes('link')
            const href = linkAttributes.href
            
            if (href) {
                setLinkUrl(href)
                // Check if the link is internal or external
                try {
                    const url = new URL(href);
                    const isInternal = url.hostname.includes('trpe.ae');
                    setLinkStatus(isInternal ? 'This link will be followed (internal link)' : 'This link will have nofollow attribute (external link)');
                } catch (e) {
                    setLinkStatus('');
                }
            } else {
                setLinkUrl('')
                setLinkStatus('')
            }
        }
    }, [isLinkPopoverOpen, editor])

    const setLink = useCallback((e: React.FormEvent) => {
        e.preventDefault()
        e.stopPropagation() // Add this line to stop event bubbling
        if (!editor) return

        if (linkUrl === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
        } else {
            let url = linkUrl.trim()
            if (!url.match(/^(https?:\/\/|mailto:|tel:)/i)) {
                url = `https://${url}`
            }

            try {
                const urlObj = new URL(url)
                // Automatically determine if nofollow should be added based on domain
                const isInternalLink = urlObj.hostname.includes('trpe.ae')
                
                // Build link attributes - no rel for internal links, nofollow for external
                const attrs = {
                    href: url,
                    target: '_blank' as string | null,
                    rel: isInternalLink ? null : 'nofollow', // Add nofollow only for external links
                    class: null as string | null
                }
                
                editor
                    .chain()
                    .focus()
                    .extendMarkRange('link')
                    .setLink(attrs)
                    .run()
                setIsLinkPopoverOpen(false)
            } catch (e) {
                console.error('Invalid URL')
            }
        }
    }, [editor, linkUrl])

    // Memoized toolbar button handlers
    const handleBoldClick = useCallback(() => editor?.chain().focus().toggleBold().run(), [editor])
    const handleItalicClick = useCallback(() => editor?.chain().focus().toggleItalic().run(), [editor])
    const handleUnderlineClick = useCallback(() => editor?.chain().focus().toggleUnderline().run(), [editor])
    const handleStrikeClick = useCallback(() => editor?.chain().focus().toggleStrike().run(), [editor])
    const handleBulletListClick = useCallback(() => editor?.chain().focus().toggleBulletList().run(), [editor])
    const handleOrderedListClick = useCallback(() => editor?.chain().focus().toggleOrderedList().run(), [editor])
    const handleAlignLeftClick = useCallback(() => editor?.chain().focus().setTextAlign('left').run(), [editor])
    const handleAlignCenterClick = useCallback(() => editor?.chain().focus().setTextAlign('center').run(), [editor])
    const handleAlignRightClick = useCallback(() => editor?.chain().focus().setTextAlign('right').run(), [editor])
    const handleAlignJustifyClick = useCallback(() => editor?.chain().focus().setTextAlign('justify').run(), [editor])
    const handleBlockquoteClick = useCallback(() => editor?.chain().focus().toggleBlockquote().run(), [editor])
    const handleUndoClick = useCallback(() => editor?.chain().focus().undo().run(), [editor])
    const handleRedoClick = useCallback(() => editor?.chain().focus().redo().run(), [editor])

    // Memoized heading handlers
    const handleParagraphClick = useCallback(() => editor?.chain().focus().setParagraph().run(), [editor])
    const handleH2Click = useCallback(() => editor?.chain().focus().toggleHeading({ level: 2 }).run(), [editor])
    const handleH3Click = useCallback(() => editor?.chain().focus().toggleHeading({ level: 3 }).run(), [editor])
    const handleH4Click = useCallback(() => editor?.chain().focus().toggleHeading({ level: 4 }).run(), [editor])
    const handleH5Click = useCallback(() => editor?.chain().focus().toggleHeading({ level: 5 }).run(), [editor])

    // Memoized link URL change handler
    const handleLinkUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setLinkUrl(e.target.value);
        // Update link status when URL changes
        const url = e.target.value.trim();
        if (url) {
            try {
                const urlWithProtocol = url.match(/^(https?:\/\/|mailto:|tel:)/i) ? url : `https://${url}`;
                const urlObj = new URL(urlWithProtocol);
                const isInternal = urlObj.hostname.includes('trpe.ae');
                setLinkStatus(isInternal ? 
                    'This link will be followed (internal link)' : 
                    'This link will have nofollow attribute (external link)');
            } catch (e) {
                setLinkStatus('');
            }
        } else {
            setLinkStatus('');
        }
    }, [])

    // Memoized heading click handler
    const handleHeadingSelect = useCallback((value: string) => {
        if (value === 'paragraph') {
            handleParagraphClick()
        } else if (value === 'h2') {
            handleH2Click()
        } else if (value === 'h3') {
            handleH3Click()
        } else if (value === 'h4') {
            handleH4Click()
        } else if (value === 'h5') {
            handleH5Click()
        }
    }, [handleParagraphClick, handleH2Click, handleH3Click, handleH4Click, handleH5Click])

    if (!editor) return null

    const getCurrentHeading = () => {
        if (editor.isActive('paragraph')) return 'Paragraph'
        if (editor.isActive('heading', { level: 2 })) return 'Heading 2'
        if (editor.isActive('heading', { level: 3 })) return 'Heading 3'
        if (editor.isActive('heading', { level: 4 })) return 'Heading 4'
        if (editor.isActive('heading', { level: 5 })) return 'Heading 5'
        return 'Paragraph'
    }

    return (
        <div className="border-b flex flex-wrap gap-1 p-1">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 font-normal"
                    >
                        {getCurrentHeading()}
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {headingOptions.map((option) => (
                        <DropdownMenuItem
                            key={option.value}
                            onSelect={() => handleHeadingSelect(option.value)}
                            className="min-w-[180px]"
                        >
                            {option.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-px h-6 bg-border mx-1" />

            <ToolbarButton
                onClick={handleBoldClick}
                isActive={editor.isActive('bold')}
            >
                <Bold className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
                onClick={handleItalicClick}
                isActive={editor.isActive('italic')}
            >
                <Italic className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
                onClick={handleUnderlineClick}
                isActive={editor.isActive('underline')}
            >
                <UnderlineIcon className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
                onClick={handleStrikeClick}
                isActive={editor.isActive('strike')}
            >
                <Strikethrough className="h-4 w-4" />
            </ToolbarButton>

            <div className="w-px h-6 bg-border mx-1" />

            <ToolbarButton
                onClick={handleBulletListClick}
                isActive={editor.isActive('bulletList')}
            >
                <List className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
                onClick={handleOrderedListClick}
                isActive={editor.isActive('orderedList')}
            >
                <ListOrdered className="h-4 w-4" />
            </ToolbarButton>

            <div className="w-px h-6 bg-border mx-1" />

            <ToolbarButton
                onClick={handleAlignLeftClick}
                isActive={editor.isActive({ textAlign: 'left' })}
            >
                <AlignLeft className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
                onClick={handleAlignCenterClick}
                isActive={editor.isActive({ textAlign: 'center' })}
            >
                <AlignCenter className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
                onClick={handleAlignRightClick}
                isActive={editor.isActive({ textAlign: 'right' })}
            >
                <AlignRight className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
                onClick={handleAlignJustifyClick}
                isActive={editor.isActive({ textAlign: 'justify' })}
            >
                <AlignJustify className="h-4 w-4" />
            </ToolbarButton>

            <div className="w-px h-6 bg-border mx-1" />

            <Popover
                open={isLinkPopoverOpen}
                onOpenChange={setIsLinkPopoverOpen}
            >
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={cn(
                            'h-8 w-8 p-0',
                            editor.isActive('link') && 'bg-muted hover:bg-muted'
                        )}
                    >
                        <LinkIcon className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-3 bg-popover shadow-md border border-border" style={{ opacity: 1 }}>
                    <form onSubmit={setLink} className="flex flex-col gap-2">
                        <Input
                            placeholder="Enter URL"
                            value={linkUrl}
                            onChange={handleLinkUrlChange}
                            className="flex-1"
                        />
                        {linkStatus && (
                            <div className="text-sm text-muted-foreground p-2 bg-background border rounded">
                                {linkStatus}
                            </div>
                        )}
                        <Button type="submit">
                            {editor.isActive('link') ? 'Update' : 'Create'}
                        </Button>
                    </form>
                </PopoverContent>
            </Popover>

            <ToolbarButton
                onClick={handleBlockquoteClick}
                isActive={editor.isActive('blockquote')}
            >
                <Quote className="h-4 w-4" />
            </ToolbarButton>

            <div className="w-px h-6 bg-border mx-1" />

            <ToolbarButton
                onClick={handleUndoClick}
                disabled={!editor.can().undo()}
            >
                <Undo className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
                onClick={handleRedoClick}
                disabled={!editor.can().redo()}
            >
                <Redo className="h-4 w-4" />
            </ToolbarButton>
        </div>
    )
})

MenuBar.displayName = 'MenuBar';

interface TipTapEditorProps {
    name: string
    control: Control<any>
    defaultValue?: string
}

export const TipTapEditor = memo<TipTapEditorProps>(({
                                 name,
                                 control,
                                 defaultValue = '',
                             }) => {
    const { field } = useController({
        name,
        control,
        defaultValue,
    })

    const editor = useEditor({
        extensions: [
            StarterKit,
            CharacterCount.configure({
                mode: 'textSize',
            }),
            Typography,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right', 'justify'],
            }),
            Underline,
            Link.extend({
                addAttributes() {
                    return {
                        href: {
                            default: null,
                        },
                        target: {
                            default: '_blank',
                        },
                        rel: {
                            // Don't set a default rel value - we'll manage the rel attribute in the setLink function
                            default: null,
                        },
                    }
                },
                // Custom validate function for links
                validateUrl(url: string) {
                    try {
                        const parsedUrl = url.trim().startsWith('http') ? url : `https://${url}`
                        new URL(parsedUrl)
                        return true
                    } catch (e) {
                        return false
                    }
                },
                // Parse links from HTML and automatically set rel attributes based on domain
                parseHTML() {
                    return [
                        {
                            tag: 'a[href]:not([href *= "javascript:" i])',
                            getAttrs: (element) => {
                                if (typeof element === 'string') return {}
                                
                                const el = element as HTMLElement
                                const href = el.getAttribute('href')
                                
                                if (!href) return {}
                                
                                try {
                                    const url = new URL(href)
                                    const isInternalLink = url.hostname.includes('trpe.ae')
                                    
                                    // For internal links, don't include rel at all
                                    const result: Record<string, string | null> = {
                                        href,
                                        target: el.getAttribute('target') || '_blank',
                                    };
                                    
                                    // Add nofollow only for external links
                                    if (!isInternalLink) {
                                        result.rel = 'nofollow';
                                    }
                                    
                                    return result;
                                } catch (e) {
                                    return {
                                        href,
                                        target: el.getAttribute('target') || '_blank',
                                    }
                                }
                            }
                        }
                    ]
                }
            }).configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline underline-offset-4 hover:text-primary/80',
                },
                // Important: Don't add default rel attributes as we're managing them manually
                protocols: [],
                autolink: false,
                defaultProtocol: 'https',
                linkOnPaste: true,
            }),
        ],
        content: field.value || '<p></p>',
        autofocus: 'end',
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-hidden prose-headings:mb-3 prose-headings:mt-6 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-h5:text-base prose-p:my-3 prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:italic min-h-[300px]',
            },
        },
        onUpdate: ({ editor }) => {
            field.onChange(editor.getHTML())
        },
    })

    return (
        <div className="border rounded-lg overflow-hidden bg-background">
            <MenuBar editor={editor} />
            <div id={'tip-tap'} className="relative px-4 py-3">
                <div className="min-h-[300px] cursor-text max-h-[500px] overflow-y-auto">
                    <EditorContent editor={editor} />
                </div>
                {editor && (
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground border-t pt-2">
                        <div>
                            Words: {editor.storage.characterCount.words()}
                        </div>
                        <div>
                            Characters: {editor.storage.characterCount.characters()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
})

TipTapEditor.displayName = 'TipTapEditor';