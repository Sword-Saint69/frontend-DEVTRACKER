# Evervault Card Component

## Overview
A stunning card component with an amazing hover effect that reveals encrypted text and a mixed gradient background. Perfect for showcasing features, products, or creating eye-catching call-to-action sections.

---

## 📦 Installation

The Evervault Card component has been manually added to your project:

**Location**: `/src/components/ui/evervault-card.tsx`
**Demo**: `/src/components/EvervaultCardDemo.tsx`

---

## 🎨 Features

- ✅ **Interactive Hover Effect**: Reveals encrypted random text on mouse movement
- ✅ **Gradient Animation**: Beautiful gradient that follows the cursor
- ✅ **Customizable**: Easy to customize colors, size, and content
- ✅ **Dark Mode Support**: Works seamlessly with light and dark themes
- ✅ **Smooth Animations**: Powered by Framer Motion
- ✅ **Responsive**: Works on all screen sizes

---

## 🚀 Usage

### Basic Example

```tsx
import { EvervaultCard } from "@/components/ui/evervault-card";

export function MyComponent() {
  return (
    <div className="max-w-sm">
      <EvervaultCard text="hover" />
    </div>
  );
}
```

### Complete Example with Border Icons

```tsx
import { EvervaultCard, Icon } from "@/components/ui/evervault-card";

export function FeatureCard() {
  return (
    <div className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-start max-w-sm mx-auto p-4 relative h-[30rem]">
      {/* Corner Icons */}
      <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

      {/* Evervault Card */}
      <EvervaultCard text="hover" />

      {/* Description */}
      <h2 className="dark:text-white text-black mt-4 text-sm font-light">
        Hover over this card to reveal an awesome effect. Running out of copy here.
      </h2>
      
      {/* Badge */}
      <p className="text-sm border font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-2 py-0.5">
        Watch me hover
      </p>
    </div>
  );
}
```

### Custom Text

```tsx
<EvervaultCard text="Pro" />
<EvervaultCard text="99" />
<EvervaultCard text="✓" />
```

### Custom Styling

```tsx
<EvervaultCard 
  text="NEW" 
  className="w-64 h-64"
/>
```

---

## 📋 Props

### EvervaultCard

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | `undefined` | The text displayed in the center of the card |
| `className` | `string` | `""` | Additional CSS classes for styling |

### Icon

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | CSS classes for the icon styling |

---

## 🎯 Use Cases

### 1. **Pricing Cards**
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  <EvervaultCard text="$9" />
  <EvervaultCard text="$29" />
  <EvervaultCard text="$99" />
</div>
```

### 2. **Feature Highlights**
```tsx
<div className="max-w-sm">
  <EvervaultCard text="AI" />
  <h3 className="text-xl font-bold mt-4">AI-Powered</h3>
  <p className="text-slate-600 dark:text-slate-400">
    Experience the future of technology
  </p>
</div>
```

### 3. **Product Showcase**
```tsx
<div className="flex flex-col items-center">
  <EvervaultCard text="NEW" />
  <h2 className="text-2xl font-bold mt-4">Latest Release</h2>
  <p>Check out our newest product</p>
</div>
```

### 4. **Status Indicators**
```tsx
<EvervaultCard text="✓" />
<EvervaultCard text="✗" />
<EvervaultCard text="⟳" />
```

---

## 🎨 Customization

### Change Gradient Colors

Edit the gradient in `evervault-card.tsx`:

```tsx
<motion.div
  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-700 opacity-0 group-hover/card:opacity-100 backdrop-blur-xl transition duration-500"
  style={style}
/>
```

**Available Gradient Combinations:**
- `from-green-500 to-blue-700` (default)
- `from-purple-500 to-pink-700`
- `from-orange-500 to-red-700`
- `from-cyan-500 to-blue-700`
- `from-yellow-500 to-orange-700`

### Adjust Hover Radius

Change the radial gradient size in `CardPattern`:

```tsx
const maskImage = useMotionTemplate`radial-gradient(300px at ${mouseX}px ${mouseY}px, white, transparent)`;
```

### Modify Text Display

Change the center circle appearance:

```tsx
<div className="relative h-52 w-52 rounded-full flex items-center justify-center text-white font-bold text-5xl">
  <div className="absolute w-full h-full bg-white/[0.9] dark:bg-black/[0.9] blur-sm rounded-full" />
  <span className="dark:text-white text-black z-20">{text}</span>
</div>
```

---

## 🔧 Technical Details

### Dependencies
- **Framer Motion**: For smooth animations and motion values
- **React**: Core library
- **Tailwind CSS**: For styling

### How It Works

1. **Mouse Tracking**: Uses Framer Motion's `useMotionValue` to track mouse position
2. **Random String Generation**: Generates random characters on each mouse move
3. **Gradient Mask**: Creates a radial gradient mask that follows the cursor
4. **Layered Effects**: Combines multiple layers (gradient, text, blur) for the effect

### Performance

- ✅ GPU-accelerated animations
- ✅ Optimized re-renders using motion values
- ✅ Lightweight random string generation
- ✅ Efficient event handling

---

## 🎭 Animation Details

### Transition Durations
- **Gradient fade**: 500ms
- **Opacity change**: 500ms
- **Backdrop blur**: Instant

### Hover States
- `opacity-0` → `opacity-100` (gradient)
- Random text regeneration on mouse move
- Smooth radial gradient follow

---

## 📱 Responsive Design

The card automatically adapts to its container. Recommended breakpoints:

```tsx
<div className="w-full sm:w-64 md:w-80 lg:w-96">
  <EvervaultCard text="hover" />
</div>
```

---

## 🌗 Dark Mode

The component fully supports dark mode out of the box:

- Light mode: Black text, white blur
- Dark mode: White text, black blur
- Gradient works in both themes

---

## 🐛 Troubleshooting

### Issue: Card doesn't show hover effect

**Solution**: Ensure the parent container has proper dimensions:
```tsx
<div className="h-64 w-64">
  <EvervaultCard text="hover" />
</div>
```

### Issue: Text is not visible

**Solution**: Check the contrast between text and background:
```tsx
<span className="dark:text-white text-black z-20">{text}</span>
```

### Issue: Animation is laggy

**Solution**: Reduce the random string length:
```tsx
const str = generateRandomString(1000); // Instead of 1500
```

---

## 💡 Pro Tips

1. **Keep text short**: 1-4 characters work best for visual impact
2. **Use with borders**: The corner icons add a premium feel
3. **Combine with typography**: Add descriptions below the card
4. **Grid layouts**: Works great in product/pricing grids
5. **CTAs**: Perfect for attention-grabbing call-to-action sections

---

## 🎬 Live Demo

Check out the demo component at:
```
/src/components/EvervaultCardDemo.tsx
```

Import and use it anywhere in your app:
```tsx
import { EvervaultCardDemo } from "@/components/EvervaultCardDemo";

<EvervaultCardDemo />
```

---

## 📚 Additional Resources

- [Aceternity UI](https://ui.aceternity.com/components/evervault-card) - Original component inspiration
- [Framer Motion](https://www.framer.com/motion/) - Animation library documentation
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework

---

## 🔄 Updates & Maintenance

**Version**: 1.0.0  
**Last Updated**: 2025-10-16  
**Dependencies**:
- framer-motion: ^12.23.22
- react: ^19.1.1
- tailwindcss: ^3.4.18

---

## 🎉 Enjoy!

The Evervault Card is now ready to use in your DevTracker application. Create stunning visual effects and impress your users with this modern, interactive component!
