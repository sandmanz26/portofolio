import { useLightbox } from '../hooks/useLightbox.jsx';
import Reveal from './Reveal';
import { useContent } from '../admin/ContentContext';
import ImageManagerItem from '../admin/ImageManagerItem';
import AddImageTile from '../admin/AddImageTile';

const GALLERY_IMAGE_RULES = { aspect: '4:3', minWidth: 900, minHeight: 675 };

// Flexible photo grid — any number of {id, image, alt} items. Pass
// `section` (and optional `entityKey`) to turn on admin add/replace/
// delete controls for that images-table group; omit it for a plain
// read-only gallery.
export default function Gallery({ items, section, entityKey = null }) {
  const { open } = useLightbox();
  const { isEditMode, addGalleryImage, updateImageById, deleteImageById } = useContent();
  const images = items.map((it) => ({ src: it.image, alt: it.alt }));
  const editable = Boolean(section) && isEditMode;

  return (
    <Reveal className="gallery">
      {items.map((it, i) =>
        editable ? (
          <div className="gallery__item" key={it.id}>
            <ImageManagerItem
              image={it.image}
              alt={it.alt}
              rules={GALLERY_IMAGE_RULES}
              onImageClick={() => open(images, i)}
              onReplace={(url) => updateImageById(it.id, { image: url })}
              onDelete={() => deleteImageById(it.id)}
            />
          </div>
        ) : (
          <div className="gallery__item" key={it.id} onClick={() => open(images, i)}>
            <img src={it.image} alt={it.alt} loading="lazy" />
          </div>
        )
      )}
      {editable && (
        <div className="gallery__item">
          <AddImageTile
            rules={GALLERY_IMAGE_RULES}
            onAdd={(url) => addGalleryImage(section, entityKey, 'gallery', { image: url, alt: '' })}
          />
        </div>
      )}
    </Reveal>
  );
}
