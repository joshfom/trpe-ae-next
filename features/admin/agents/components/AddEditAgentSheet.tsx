"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AgentFormSchema, AgentFormType } from '../form-schema/agent-form-schema';
import { addAgentAction } from '@/actions/admin/add-agent-action';
import { updateAgentAction } from '@/actions/admin/update-agent-action';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2, X } from 'lucide-react';
import { SingleImageDropzone } from '@/components/single-image-dropzone';
import { useEdgeStore } from '@/db/edgestore';
import { TipTapEditor } from '@/components/TiptapEditor';

interface AddEditAgentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  agent?: any; // For editing existing agent
}

export function AddEditAgentSheet({ isOpen, onClose, agent }: AddEditAgentSheetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);
  const { edgestore } = useEdgeStore();
  const isEditing = !!agent;

  const form = useForm<AgentFormType>({
    resolver: zodResolver(AgentFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      title: '',
      bio: '',
      rera: '',
      avatarUrl: '',
      isVisible: false,
      isLuxe: false,
      order: 100,
    },
  });

  // Reset form when agent changes or when opening for new agent
  useEffect(() => {
    if (isOpen) {
      if (agent) {
        // Editing existing agent
        form.reset({
          firstName: agent?.firstName || '',
          lastName: agent?.lastName || '',
          email: agent?.email || '',
          phone: agent?.phone || '',
          title: agent?.title || '',
          bio: agent?.bio || '',
          rera: agent?.rera || '',
          avatarUrl: agent?.avatarUrl || '',
          isVisible: agent?.isVisible || false,
          isLuxe: agent?.isLuxe || false,
          order: agent?.order || 100,
        });
      } else {
        // Adding new agent
        form.reset({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          title: '',
          bio: '',
          rera: '',
          avatarUrl: '',
          isVisible: false,
          isLuxe: false,
          order: 100,
        });
      }
    }
  }, [isOpen, agent, form]);

  // Avatar upload function
  const updateAvatar = useCallback(async (file: File | undefined) => {
    if (file) {
      try {
        const res = await edgestore.publicFiles.upload({
          file,
          onProgressChange: (progress) => {
            console.log('Avatar upload progress:', progress);
          },
        });

        setAvatarFile(file);
        form.setValue('avatarUrl', res.url);
        toast.success('Avatar uploaded successfully');
      } catch (error) {
        console.error('Error uploading avatar:', error);
        toast.error('Failed to upload avatar');
      }
    }
  }, [edgestore, form]);

  const handleRemoveAvatar = useCallback(() => {
    setAvatarFile(undefined);
    form.setValue('avatarUrl', '');
  }, [form]);

  const onSubmit = async (values: AgentFormType) => {
    setIsLoading(true);
    
    try {
      let result;
      
      if (isEditing) {
        result = await updateAgentAction(agent.id, values);
      } else {
        result = await addAgentAction(values);
      }

      if (result.success) {
        toast.success(isEditing ? 'Agent updated successfully' : 'Agent added successfully');
        form.reset();
        onClose();
      } else {
        toast.error(result.error || 'An error occurred');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Error saving agent:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto px-6 py-8 max-w-3xl mx-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Edit Agent' : 'Add New Agent'}</SheetTitle>
          <SheetDescription>
            {isEditing ? 'Update agent information' : 'Fill in the details to add a new agent'}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+971 50 123 4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Senior Agent" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rera"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RERA Number</FormLabel>
                  <FormControl>
                    <Input placeholder="12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {field.value && (
                        <div className="relative w-32 h-32 mx-auto">
                          <img
                            className="w-full h-full object-cover rounded-full"
                            src={field.value}
                            alt="Current avatar"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveAvatar}
                            className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      <SingleImageDropzone
                        width={200}
                        height={200}
                        value={avatarFile}
                        onChange={(file) => {
                          setAvatarFile(file);
                          updateAvatar(file);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <TipTapEditor
                      name="bio"
                      control={form.control}
                      defaultValue=""
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Order</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="100" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 100)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="isVisible"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel>Visible on Website</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Show this agent on the public website
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isLuxe"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel>Luxe Agent</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Mark as a luxury property specialist
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Update Agent' : 'Add Agent'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
