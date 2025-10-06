import { SVGAttributes } from 'react';

export default function FaviconLogo(props: SVGAttributes<SVGElement>) {
    return (
        <img 
            {...props} 
            src="/favicon.svg" 
            alt="Gastaro Logo"
            className="w-full h-full object-contain"
        />
    );
}
