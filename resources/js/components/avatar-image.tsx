interface AvatarImageProps {
    src: string | null;
    alt: string;
    className?: string;
    fallbackText?: string;
}

/**
 * Componente de imagen de avatar con soporte para URLs de Google
 * Incluye referrerPolicy para evitar problemas CORS con Google avatars
 */
export default function AvatarImage({ src, alt, className = '', fallbackText }: AvatarImageProps) {
    if (src) {
        return (
            <img
                src={src}
                alt={alt}
                className={className}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
            />
        );
    }

    if (fallbackText) {
        return (
            <span className={className}>
                {fallbackText}
            </span>
        );
    }

    // Fallback con inicial del nombre
    const initial = alt.charAt(0).toUpperCase();
    return (
        <span className={className}>
            {initial}
        </span>
    );
}
