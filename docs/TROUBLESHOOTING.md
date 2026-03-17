# Troubleshooting

> 컴포넌트 개발 중 자주 발생하는 문제와 해결 방법.
> Figma MCP 관련 트러블슈팅은 [FIGMA_TO_CODE.md §J](./FIGMA_TO_CODE.md#j-트러블슈팅) 참고.

---

## Theme Not Switching

**Problem**: Components don't change color when switching themes.

**Solutions**:
- Ensure `data-theme` attribute is set on an ancestor element
- Verify you're using `semantic-*` tokens, not `primitive-*` tokens
- Check that `src/tokens/tokens.css` is imported in `src/index.css`
- Inspect element in browser DevTools to see if CSS variables are applied

---

## Typography Not Applying

**Problem**: Text size or weight doesn't match Figma design.

**Solutions**:
- Use composite typography tokens: `typography-16-medium` not `text-base font-medium`
- Check `tailwind.config.js` has typography tokens in extends
- Verify the token exists in `src/tokens/typography.ts`
- Clear Tailwind cache: delete `node_modules/.vite` and restart dev server

---

## Colors Look Wrong

**Problem**: Colors don't match Figma or look different between themes.

**Solutions**:
- Verify you're using correct semantic token category (e.g., `text-semantic-text-on-bright-900` for dark text on light backgrounds)
- Check if you're in the correct theme context (`data-theme` attribute)
- Inspect computed CSS in DevTools to see actual color values
- Verify token mapping in JSON spec matches Figma design intent

---

## Icons Too Large/Small

**Problem**: Icon doesn't fit button or component size.

**Solutions**:
- Let component handle icon sizing internally (don't add w-/h- classes when passing icons)
- Check JSON spec for correct icon sizes per component size
- Verify icon container has size classes from spec (e.g., `w-5 h-5` for medium)
- Use `flex-shrink-0` on icon containers to prevent squishing

---

## Component Not Type-Safe

**Problem**: TypeScript errors or missing autocomplete.

**Solutions**:
- Ensure props interface extends appropriate React HTML props
- Export both interface and component from index.ts
- Use `VariantProps<typeof componentVariants>` for CVA types
- Run `npm run typecheck` to see all type errors

---

## Spacing Doesn't Match Figma

**Problem**: Padding, margin, or gaps are off.

**Solutions**:
- Double-check Figma values in px
- Use spacing token reference (16px = 4, 24px = 6, etc.)
- Remember Tailwind uses rem: 1 unit = 0.25rem = 4px
- Check if you're using correct spacing scale (p-4 vs px-4 py-4)

---

## Build Errors

**Problem**: `npm run build` fails.

**Solutions**:
- Run `npm run lint` to catch ESLint errors
- Check for unused imports
- Verify all files are properly exported
- Clear cache: `rm -rf node_modules/.vite && npm run build`
