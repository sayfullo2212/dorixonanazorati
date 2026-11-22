export default function Badge({ children, variant = 'default', size = 'sm' }) {
  const variants = {
    default: 'badge-default',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    purple: 'badge-purple',
  };
  const sizes = {
    xs: 'badge-xs',
    sm: 'badge-sm',
    md: 'badge-md',
  };
  return (
    <span className={`badge ${variants[variant] || variants.default} ${sizes[size] || sizes.sm}`}>
      {children}
    </span>
  );
}
