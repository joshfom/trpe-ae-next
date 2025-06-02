"use client";

import { TipTapView as OriginalTipTapView } from "./TiptapView";

/**
 * COMPATIBILITY LAYER - DO NOT USE DIRECTLY
 * This is a wrapper to maintain backward compatibility with existing code.
 * Please use ServerProcessedTiptap for new code.
 * 
 * @deprecated Use ServerProcessedTiptap instead which processes HTML on the server
 */
export const TipTapView = OriginalTipTapView;
