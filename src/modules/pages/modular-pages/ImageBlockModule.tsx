import { ModuleFrame } from './ModuleFrame.tsx'
import { readCopy, readString } from './copy.ts'
import type { ModuleComponentProps } from './types.ts'

export function ImageBlockModule({ instance }: ModuleComponentProps) {
  const src = readString(instance.config.src)
  const alt = readString(instance.config.alt)
  const caption = readCopy(instance.config.captionKey, instance.config.caption)

  return (
    <ModuleFrame
      instance={instance}
      className="module-image"
      label={alt || 'Image'}
    >
      <figure className="module-image__figure">
        <img src={src} alt={alt} />
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </ModuleFrame>
  )
}
