interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "light" | "outline";
  children: React.ReactNode;
}

/**
 * A common action and CTA button component for global reuse.
 * It supports multiple visual variants and standard button attributes.
 * It's now themed according to your global.css and written in TypeScript.
 * @param {ButtonProps} props
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  type = 'button',
  children,
  className = '',
  disabled = false,
  ...props
}) => {
  // Base classes applicable to all button variants
  const baseClasses = 'px-5 py-2 rounded-[var(--radius)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)] focus:ring-offset-[var(--background)]';

  // Variant-specific classes, updated for the new theme
  const variantClasses = {
    primary: 'bg-[var(--color-accent)] text-white font-semibold transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    light: 'bg-gray-500/10 text-[var(--foreground)] font-medium hover:bg-gray-500/20 disabled:bg-gray-500/5 disabled:text-[var(--muted)] disabled:cursor-not-allowed',
    outline: 'bg-transparent border border-[var(--muted)] text-[var(--color-accent)] font-medium hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 disabled:border-[var(--muted)] disabled:text-[var(--muted)] disabled:cursor-not-allowed disabled:hover:bg-transparent',
  };

  // Combine all classes
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button
      type={type}
      disabled={disabled}
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  );
};