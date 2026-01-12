# Logo Assets

Place your NNRC logo files here:

- `square-patch.svg` - Primary NNRC patch logo
- `runner-mascot.svg` - Secondary runner mascot illustration

## Usage

```tsx
import Image from 'next/image';

// Primary logo
<Image 
  src="/logos/square-patch.svg" 
  alt="No Name Running Club"
  width={120}
  height={120}
/>

// Mascot
<Image 
  src="/logos/runner-mascot.svg" 
  alt="NNRC Runner"
  width={200}
  height={150}
/>
```

## Guidelines

- **Minimum Size**: 60px × 60px for the patch logo
- **Clear Space**: Maintain space equal to the height of one letter around all sides
- **Backgrounds**: Works best on white, light gray, or dark backgrounds
