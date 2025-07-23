# 🧱 Frontend Component Blueprint

This guide outlines the components that have to be built in the project. Every Component's empty files have already been created. Every component inside this guide is defined with:

- What it is
- Props structure
- Tailwind classes
- Functionality
- Why it's included in this project

Designed for a **calm, creative, minimalist UI** with custom CSS variables (`globals.css`) and TailwindCSS v4.

---

## /components/ui

---

### 🧱 Button.tsx

**Purpose**: Common action and CTA button component for global reuse.

- **Props**:
  - `variant?: "primary" | "light" | "outline"`
  - `type?: "button" | "submit"`
  - `onClick?`
  - `disabled?`
  - `children`

- **Tailwind Classes**:  
  `px-5 py-2 font-semibold rounded-[var(--radius)] transition duration-150` + variant styles.

- **Functionality**:  
  General use button for forms, CTAs, modals, etc.

---

### 🧱 Input.tsx

**Purpose**: Standard form input field.

- **Props**:
  - `type?: string`
  - `name`
  - `placeholder`
  - `value`
  - `onChange`
  - `error?`
  - `label?`

- **Tailwind Classes**:  
  `w-full px-3 py-2 border rounded-[var(--radius)] text-[var(--color-text)] bg-[var(--color-surface)] focus:ring-[var(--color-accent)] focus:outline-none`

---

### 🧱 Textarea.tsx

**Purpose**: For longer form inputs like feedback, messages.

- **Props**:
  - `rows?: number`
  - `value`
  - `onChange`
  - `label?`
  - `error?`

- **Tailwind Classes**:  
  Same as `Input` + `resize-none`

---

### 🧱 Select.tsx

**Purpose**: Dropdown menu for form options.

- **Props**:
  - `options: string[]`
  - `value`
  - `onChange`
  - `label?`

- **Tailwind Classes**:  
  Same as `Input`.

---

### 🧱 Checkbox.tsx

**Purpose**: True/false form field.

- **Props**:
  - `label`
  - `checked`
  - `onChange`

- **Tailwind Classes**:  
  `form-checkbox text-[var(--color-accent)] mr-2`

---

### 🧱 RadioGroup.tsx

**Purpose**: Single-select options, grouped.

- **Props**:
  - `options: string[]`
  - `name`
  - `value`
  - `onChange`

- **Tailwind Classes**:  
  Each radio input: `form-radio text-[var(--color-accent)]`

---

### 🧱 Switch.tsx

**Purpose**: ON/OFF toggle UI (e.g. dark mode).

- **Props**:
  - `checked`
  - `onChange`

- **Tailwind Classes**:  
  `w-10 h-6 rounded-full transition bg-gray-200 checked:bg-[var(--color-accent)]`

---

### 🧱 Alert.tsx

**Purpose**: Notification for success/errors/info.

- **Props**:
  - `type: "info" | "success" | "warning" | "error"`
  - `message`
  - `icon?`

- **Tailwind Classes**:  
  `rounded-lg p-4 border-l-4 text-[var(--color-text)] animate-pulse` (optional)

---

### 🧱 Badge.tsx

**Purpose**: Small tag indicators for status, category.

- **Props**:
  - `text`
  - `variant?: "default" | "pill"`
  - `color?`

- **Tailwind Classes**:  
  `inline-block px-3 py-1 rounded-2xl text-xs font-medium bg-[var(--color-accent2)] text-white`

---

### 🧱 Avatar.tsx

**Purpose**: Profile photo or initials fallback.

- **Props**:
  - `src`
  - `name`
  - `size?: "sm" | "md" | "lg"`

- **Tailwind Classes**:  
  `rounded-full w-8 h-8 bg-gray-300 text-xs flex items-center justify-center uppercase`

---

### 🧱 Card.tsx

**Purpose**: Layout block for features, info panels.

- **Props**:
  - `children`
  - `variant?: "default" | "glass"`

- **Tailwind Classes**:  
  `p-6 rounded-[var(--radius)] shadow-sm bg-[var(--surface)]`  
  Glass: add `backdrop-blur bg-white/70`

---

### 🧱 Modal.tsx

**Purpose**: Inline popup/modal for forms or UX.

- **Props**:
  - `open`
  - `onClose`
  - `children`
  - `title?`

- **Tailwind Classes**:  
  `fixed inset-0 flex items-center justify-center bg-black/40`

---

### 🧱 Loader.tsx

**Purpose**: Circular loading animation.

- **Props**:
  - `size?: "sm" | "md" | "lg"`

- **Tailwind Classes**:  
  `animate-spin border-4 border-gray-300 border-t-[var(--color-accent)] rounded-full`

---

### 🧱 Table.tsx

**Purpose**: Display data in row/column format.

- **Props**:
  - `headers: string[]`
  - `rows: object[]`
  - `columns: string[]`

- **Tailwind Classes**:  
  `w-full table-auto border-collapse text-left`

---

### 🧱 Tabs.tsx

**Purpose**: Switch between logically grouped content.

- **Props**:
  - `tabs: string[]`
  - `selected: string`
  - `onChange(tab: string)`

- **Tailwind Classes**:  
  `inline-block px-4 py-2 rounded hover:bg-[var(--color-accent)] text-sm transition`

---

### 🧱 Navbar.tsx

**Purpose**: Persistent top navigation bar.

- **Props**: Provide as appropriate.

- **Tailwind Classes**:  
  `fixed top-0 inset-x-0 bg-white px-6 py-4 shadow-md flex justify-between items-center`

---

### 🧱 Sidebar.tsx

**Purpose**: Optional side navigation (e.g. dashboard views).

- **Props**:
  - `links: { name: string; href: string }[]`

- **Tailwind Classes**:  
  `fixed h-screen w-64 bg-[var(--surface)] shadow-xl px-4 py-6`

---

### 🧱 Footer.tsx

**Purpose**: Page-ending secondary nav/info.

- **Props**:
  - `links?`, `year?`, `branding?`

- **Tailwind Classes**:  
  `text-[var(--color-muted)] py-6 text-center text-xs`

---

### 🧱 EmptyState.tsx

**Purpose**: Message shown when section has no data.

- **Props**:
  - `title`
  - `description`
  - `icon?`
  - `action?`

- **Tailwind Classes**:  
  `flex flex-col items-center justify-center py-16 text-center text-sm text-[var(--color-muted)]`

---

## /components/layout

---

### 🧱 PageHeader.tsx

**Purpose**: Title + potential actions at top of page.

- **Props**:
  - `title`
  - `subtitle?`
  - `action?`

- **Tailwind Classes**:  
  `flex justify-between items-center mb-6`

---

### 🧱 FeatureGrid.tsx

**Purpose**: Display grid of agenda features/sections.

- **Props**:
  - `features: { title, icon?, description }[]`

- **Tailwind Classes**:  
  `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8`

---

### 🧱 SectionTitle.tsx

**Purpose**: Consistent typography for sections.

- **Props**:
  - `title`, `subtitle`

- **Tailwind Classes**:  
  `text-2xl font-semibold text-[var(--color-foreground)]`

---

### 🧱 Breadcrumbs.tsx (Optional)

**Purpose**: Visual hierarchy trail for navigation.

- **Props**:
  - `paths: { name: string; href: string }[]`

- **Tailwind Classes**:  
  `text-xs text-[var(--color-muted)] space-x-2`

---

## /components/shared

---

### 🧱 Heading.tsx

**Purpose**: Semantic responsive heading (`h1`–`h4`) component

- **Props**:
  - `as?: 'h1' | 'h2' | 'h3' | 'h4'`
  - `children`

- **Tailwind Classes**:  
  Use `text-2xl`, `text-3xl`, `font-bold`, responsive classes as per `as`

---