'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  fill?: boolean;
  sizes?: string;
  onClick?: () => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

/**
 * Optimized Image component with built-in performance features
 *
 * Features:
 * - Automatic blur placeholder
 * - Error handling with fallback
 * - Loading state management
 * - Responsive sizing
 * - Performance optimizations
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  fill = false,
  sizes,
  onClick,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Default blur placeholder
  const defaultBlurDataURL =
    blurDataURL ||
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(e);
  };

  // If there's an error, show fallback
  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-muted/50 ${className}`}
        style={fill ? {} : { width, height }}
      >
        <div className='text-muted-foreground text-center p-4'>
          <div className='w-8 h-8 mx-auto mb-2 bg-muted rounded' />
          <p className='text-xs'>Image unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${onClick ? 'cursor-pointer' : ''}`}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={placeholder === 'blur' ? defaultBlurDataURL : undefined}
        sizes={sizes}
        onClick={onClick}
        onLoad={handleLoad}
        onError={handleError}
      />

      {/* Loading skeleton */}
      {isLoading && (
        <div
          className='absolute inset-0 bg-muted/50 animate-pulse'
          style={fill ? {} : { width, height }}
        />
      )}
    </div>
  );
}

/**
 * Avatar image component with fallback
 */
export function OptimizedAvatar({
  src,
  alt,
  size = 40,
  className = '',
  fallback,
}: {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
  fallback?: React.ReactNode;
}) {
  const [hasError, _setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-muted rounded-full ${className}`}
        style={{ width: size, height: size }}
      >
        {fallback || (
          <span className='text-muted-foreground text-sm font-medium'>
            {alt.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      quality={80}
    />
  );
}

/**
 * Thumbnail image component for asset cards
 */
export function OptimizedThumbnail({
  src,
  alt,
  className = '',
  onClick,
}: {
  src?: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <OptimizedImage
      src={src || '/placeholder-asset.png'}
      alt={alt}
      width={300}
      height={200}
      className={`w-full h-48 object-cover rounded-lg ${className}`}
      quality={75}
      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      onClick={onClick}
    />
  );
}
