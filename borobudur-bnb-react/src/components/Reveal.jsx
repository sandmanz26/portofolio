import { useReveal } from '../hooks/useReveal';

// <Reveal> — scroll-triggered fade/rise wrapper.
// Pass group to reveal staggered children (data-reveal-group), otherwise
// the element itself fades in (data-reveal).
export default function Reveal({ as: Tag = 'div', group = false, className = '', children, ...rest }) {
  const [ref, isVisible] = useReveal();
  const attr = group ? { 'data-reveal-group': true } : { 'data-reveal': true };
  const cls = [className, isVisible ? 'is-visible' : ''].filter(Boolean).join(' ');
  return (
    <Tag ref={ref} className={cls} {...attr} {...rest}>
      {children}
    </Tag>
  );
}
