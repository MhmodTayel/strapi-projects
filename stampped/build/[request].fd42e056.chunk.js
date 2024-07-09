"use strict";
(self["webpackChunkapi_stamped_app"] = self["webpackChunkapi_stamped_app"] || []).push([[6750],{

/***/ 60665:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const styled = __webpack_require__(88972);
const handleResponsiveValues = __webpack_require__(91554);
const theme = __webpack_require__(60468);

const _interopDefault = e => e && e.__esModule ? e : { default: e };

const styled__default = /*#__PURE__*/_interopDefault(styled);

/**
 * Prevents these attributes from being spread on the DOM node
 */
const transientProps = {
    color: true,
    cursor: true,
    height: true,
    width: true,
};
const Box = styled__default.default.div.withConfig({
    shouldForwardProp: (prop, defPropValFN) => !transientProps[prop] && defPropValFN(prop),
}) `
  // Font
  font-size: ${({ fontSize, theme: theme$1 }) => theme.extractStyleFromTheme(theme$1.fontSizes, fontSize, fontSize)};

  // Colors
  background: ${({ theme: theme$1, background }) => theme.extractStyleFromTheme(theme$1.colors, background, background)};
  color: ${({ theme: theme$1, color }) => theme.extractStyleFromTheme(theme$1.colors, color, undefined)};

  // Spaces
  ${({ theme, padding }) => handleResponsiveValues('padding', padding, theme)}
  ${({ theme, paddingTop }) => handleResponsiveValues('padding-top', paddingTop, theme)}
  ${({ theme, paddingRight }) => handleResponsiveValues('padding-right', paddingRight, theme)}
  ${({ theme, paddingBottom }) => handleResponsiveValues('padding-bottom', paddingBottom, theme)}
  ${({ theme, paddingLeft }) => handleResponsiveValues('padding-left', paddingLeft, theme)}
  ${({ theme, marginLeft }) => handleResponsiveValues('margin-left', marginLeft, theme)}
  ${({ theme, marginRight }) => handleResponsiveValues('margin-right', marginRight, theme)}
  ${({ theme, marginTop }) => handleResponsiveValues('margin-top', marginTop, theme)}
  ${({ theme, marginBottom }) => handleResponsiveValues('margin-bottom', marginBottom, theme)}

  // Responsive hiding
  ${({ theme, hiddenS }) => (hiddenS ? `${theme.mediaQueries.tablet} { display: none; }` : undefined)}
  ${({ theme, hiddenXS }) => (hiddenXS ? `${theme.mediaQueries.mobile} { display: none; }` : undefined)}
  

  // Borders
  border-radius: ${({ theme, hasRadius, borderRadius }) => (hasRadius ? theme.borderRadius : borderRadius)};
  border-style: ${({ borderStyle }) => borderStyle};
  border-width: ${({ borderWidth }) => borderWidth};
  border-color: ${({ borderColor, theme: theme$1 }) => theme.extractStyleFromTheme(theme$1.colors, borderColor, undefined)};
  border: ${({ theme, borderColor, borderStyle, borderWidth }) => {
    // This condition prevents borderColor from override the border-color attribute when not passing borderStyle nor borderWidth
    if (borderColor && !borderStyle && typeof borderWidth === 'undefined') {
        return `1px solid ${theme.colors[borderColor]}`;
    }
    // eslint-disable-next-line consistent-return
    return undefined;
}};

  // Shadows
  box-shadow: ${({ theme: theme$1, shadow }) => theme.extractStyleFromTheme(theme$1.shadows, shadow, undefined)};

  // Handlers
  pointer-events: ${({ pointerEvents }) => pointerEvents};
  &:hover {
    ${({ _hover, theme }) => (_hover ? _hover(theme) : undefined)}
  }

  // Display
  display: ${({ display }) => display};

  // Position
  position: ${({ position }) => position};
  left: ${({ left, theme: theme$1 }) => theme.extractStyleFromTheme(theme$1.spaces, left, left)};
  right: ${({ right, theme: theme$1 }) => theme.extractStyleFromTheme(theme$1.spaces, right, right)};
  top: ${({ top, theme: theme$1 }) => theme.extractStyleFromTheme(theme$1.spaces, top, top)};
  bottom: ${({ bottom, theme: theme$1 }) => theme.extractStyleFromTheme(theme$1.spaces, bottom, bottom)};
  z-index: ${({ zIndex }) => zIndex};
  overflow: ${({ overflow }) => overflow};

  // Size
  width: ${({ width, theme: theme$1 }) => theme.extractStyleFromTheme(theme$1.spaces, width, width)};
  max-width: ${({ maxWidth, theme: theme$1 }) => theme.extractStyleFromTheme(theme$1.spaces, maxWidth, maxWidth)};
  min-width: ${({ minWidth, theme: theme$1 }) => theme.extractStyleFromTheme(theme$1.spaces, minWidth, minWidth)};
  height: ${({ height, theme: theme$1 }) => theme.extractStyleFromTheme(theme$1.spaces, height, height)};
  max-height: ${({ maxHeight, theme: theme$1 }) => theme.extractStyleFromTheme(theme$1.spaces, maxHeight, maxHeight)};
  min-height: ${({ minHeight, theme: theme$1 }) => theme.extractStyleFromTheme(theme$1.spaces, minHeight, minHeight)};

  // Animation
  transition: ${({ transition }) => transition};
  transform: ${({ transform }) => transform};
  animation: ${({ animation }) => animation};

  //Flexbox children props
  flex-shrink: ${({ shrink }) => shrink};
  flex-grow: ${({ grow }) => grow};
  flex-basis: ${({ basis }) => basis};
  flex: ${({ flex }) => flex};

  // Text
  text-align: ${({ textAlign }) => textAlign};
  text-transform: ${({ textTransform }) => textTransform};
  line-height: ${({ theme: theme$1, lineHeight }) => theme.extractStyleFromTheme(theme$1.lineHeights, lineHeight, lineHeight)};

  // Cursor
  cursor: ${({ cursor }) => cursor};
`;

exports.Box = Box;


/***/ }),

/***/ 58674:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = __webpack_require__(85893);
const React = __webpack_require__(67294);
const FieldContext = __webpack_require__(44158);
const useId = __webpack_require__(24414);
const Box = __webpack_require__(60665);

const Field = React.forwardRef(({ children, name, error, hint, id, required = false, ...props }, ref) => {
    const generatedId = useId.useId(id);
    const context = React.useMemo(() => ({ name, id: generatedId, error, hint, required }), [error, generatedId, hint, name, required]);
    return (jsxRuntime.jsx(Box.Box, { ref: ref, ...props, children: jsxRuntime.jsx(FieldContext.FieldContext.Provider, { value: context, children: children }) }));
});

exports.Field = Field;


/***/ }),

/***/ 44158:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const React = __webpack_require__(67294);

const FieldContext = React.createContext({ id: '', required: false });
const useField = () => React.useContext(FieldContext);

exports.FieldContext = FieldContext;
exports.useField = useField;


/***/ }),

/***/ 73582:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = __webpack_require__(85893);
const FieldContext = __webpack_require__(44158);
const Typography = __webpack_require__(4583);

const FieldError = () => {
    const { id, error } = FieldContext.useField();
    if (!error || typeof error !== 'string') {
        return null;
    }
    return (jsxRuntime.jsx(Typography.Typography, { variant: "pi", as: "p", id: `${id}-error`, textColor: "danger600", "data-strapi-field-error": true, children: error }));
};

exports.FieldError = FieldError;


/***/ }),

/***/ 92298:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = __webpack_require__(85893);
const FieldContext = __webpack_require__(44158);
const Typography = __webpack_require__(4583);

const FieldHint = () => {
    const { id, hint, error } = FieldContext.useField();
    if (!hint || error) {
        return null;
    }
    return (jsxRuntime.jsx(Typography.Typography, { variant: "pi", as: "p", id: `${id}-hint`, textColor: "neutral600", children: hint }));
};

exports.FieldHint = FieldHint;


/***/ }),

/***/ 30969:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = __webpack_require__(85893);
const React = __webpack_require__(67294);
const styled = __webpack_require__(88972);
const FieldContext = __webpack_require__(44158);
const utils = __webpack_require__(69186);
const Box = __webpack_require__(60665);
const Flex = __webpack_require__(90291);

const _interopDefault = e => e && e.__esModule ? e : { default: e };

const styled__default = /*#__PURE__*/_interopDefault(styled);

// padding-[top|bottom] must ensure, the input matches the height of getThemeSize('input')
const PADDING_Y = {
    S: 6.5,
    M: 10.5,
};
const FieldInput = React.forwardRef(({ endAction, startAction, disabled = false, onChange, size = 'M', ...props }, ref) => {
    const { id, error, hint, name, required } = FieldContext.useField();
    let ariaDescription;
    if (error) {
        ariaDescription = `${id}-error`;
    }
    else if (hint) {
        ariaDescription = `${id}-hint`;
    }
    const hasError = Boolean(error);
    const handleChange = (e) => {
        if (!disabled && onChange) {
            onChange(e);
        }
    };
    return (jsxRuntime.jsxs(InputWrapper, { justifyContent: "space-between", hasError: hasError, disabled: disabled, children: [startAction ? (jsxRuntime.jsx(Box.Box, { paddingLeft: 3, paddingRight: 2, children: startAction })) : null, jsxRuntime.jsx(Input, { id: id, name: name, ref: ref, "aria-describedby": ariaDescription, "aria-invalid": hasError, "aria-disabled": disabled, disabled: disabled, "data-disabled": disabled ? '' : undefined, hasLeftAction: Boolean(startAction), hasRightAction: Boolean(endAction), onChange: handleChange, "aria-required": required, "$size": size, ...props }), endAction ? (jsxRuntime.jsx(Box.Box, { paddingLeft: 2, paddingRight: 3, children: endAction })) : null] }));
});
const Input = styled__default.default.input `
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding-bottom: ${({ $size }) => `${PADDING_Y[$size] / 16}rem`};
  padding-left: ${({ theme, hasLeftAction }) => (hasLeftAction ? 0 : theme.spaces[4])};
  padding-right: ${({ theme, hasRightAction }) => (hasRightAction ? 0 : theme.spaces[4])};
  padding-top: ${({ $size }) => `${PADDING_Y[$size] / 16}rem`};
  cursor: ${(props) => (props['aria-disabled'] ? 'not-allowed' : undefined)};

  color: ${({ theme }) => theme.colors.neutral800};
  font-weight: 400;
  font-size: ${(props) => props.theme.fontSizes[2]};
  display: block;
  width: 100%;
  background: inherit;

  ::placeholder {
    color: ${({ theme }) => theme.colors.neutral500};
    opacity: 1;
  }

  &[aria-disabled='true'] {
    color: inherit;
  }

  //focus managed by InputWrapper
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;
const InputWrapper = styled__default.default(Flex.Flex) `
  border: 1px solid ${({ theme, hasError }) => (hasError ? theme.colors.danger600 : theme.colors.neutral200)};
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme }) => theme.colors.neutral0};
  ${utils.inputFocusStyle()}

  ${({ theme, disabled }) => disabled
    ? styled.css `
          color: ${theme.colors.neutral600};
          background: ${theme.colors.neutral150};
        `
    : undefined}
`;

exports.FieldInput = FieldInput;
exports.InputWrapper = InputWrapper;


/***/ }),

/***/ 64919:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = __webpack_require__(85893);
const React = __webpack_require__(67294);
const styled = __webpack_require__(88972);
const FieldContext = __webpack_require__(44158);
const deprecations = __webpack_require__(52075);
const Typography = __webpack_require__(4583);
const Flex = __webpack_require__(90291);

const _interopDefault = e => e && e.__esModule ? e : { default: e };

const styled__default = /*#__PURE__*/_interopDefault(styled);

const warnOnce = deprecations.once(console.warn);
const FieldLabel = React.forwardRef(({ children, action, required: requiredDeprecatedProp, ...props }, ref) => {
    const { id, required: requiredField } = FieldContext.useField();
    const required = requiredField || requiredDeprecatedProp;
    if (requiredDeprecatedProp !== undefined) {
        warnOnce('Deprecation warning: Usage of "required" prop in FieldLabel component is deprecated. This is discouraged and will be removed in the next major release. Please use the Field component to share the required prop.');
    }
    return (jsxRuntime.jsxs(TypographyFlex, { ref: ref, variant: "pi", textColor: "neutral800", htmlFor: id, fontWeight: "bold", as: "label", ...props, children: [children, required && jsxRuntime.jsx(TypographyAsterisk, { textColor: "danger600", children: "*" }), action && jsxRuntime.jsx(Action, { marginLeft: 1, children: action })] }));
});
/**
 * NOTE!
 * This is a concious decision to not use the Box component here.
 * Partially because it must be a span to correctly be picked up,
 * but also because we don't need to add DOM nesting here when it's
 * easier to just add a new class.
 */
const TypographyFlex = styled__default.default(Typography.Typography) `
  display: flex;
  align-items: center;
`;
const TypographyAsterisk = styled__default.default(Typography.Typography) `
  line-height: 0;
`;
const Action = styled__default.default(Flex.Flex) `
  line-height: 0;

  svg path {
    fill: ${({ theme }) => theme.colors.neutral500};
  }
`;

exports.FieldLabel = FieldLabel;


/***/ }),

/***/ 90291:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const styled = __webpack_require__(88972);
const handleResponsiveValues = __webpack_require__(91554);
const Box = __webpack_require__(60665);

const _interopDefault = e => e && e.__esModule ? e : { default: e };

const styled__default = /*#__PURE__*/_interopDefault(styled);

/**
 * Prevents these attributes from being spread on the DOM node
 */
const transientProps = {
    direction: true,
};
const Flex = styled__default.default(Box.Box).withConfig({
    shouldForwardProp: (prop, defPropValFN) => !transientProps[prop] && defPropValFN(prop),
}) `
  align-items: ${({ alignItems = 'center' }) => alignItems};
  display: ${({ display = 'flex', inline }) => (inline ? 'inline-flex' : display)};
  flex-direction: ${({ direction = 'row' }) => direction};
  flex-shrink: ${({ shrink }) => shrink};
  flex-wrap: ${({ wrap }) => wrap};
  ${({ gap, theme }) => handleResponsiveValues('gap', gap, theme)};
  justify-content: ${({ justifyContent }) => justifyContent};
`;

exports.Flex = Flex;


/***/ }),

/***/ 35063:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = __webpack_require__(85893);
const styled = __webpack_require__(88972);
const handleResponsiveValues = __webpack_require__(91554);
const Box = __webpack_require__(60665);

const _interopDefault = e => e && e.__esModule ? e : { default: e };

const styled__default = /*#__PURE__*/_interopDefault(styled);

const GridWrapper = styled__default.default(Box.Box) `
  display: grid;
  grid-template-columns: repeat(${({ gridCols }) => gridCols}, 1fr);
  ${({ theme, gap }) => handleResponsiveValues('gap', gap, theme)}
`;
const Grid = (props) => {
    const { gap = '0', gridCols = 12, ...rest } = props;
    return jsxRuntime.jsx(GridWrapper, { gap: gap, gridCols: gridCols, ...rest });
};

exports.Grid = Grid;


/***/ }),

/***/ 91259:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const styled = __webpack_require__(88972);
const Box = __webpack_require__(60665);

const _interopDefault = e => e && e.__esModule ? e : { default: e };

const styled__default = /*#__PURE__*/_interopDefault(styled);

const GridItem = styled__default.default(Box.Box) `
  grid-column: span ${({ col }) => col};
  max-width: 100%;

  ${({ theme }) => theme.mediaQueries.tablet} {
    grid-column: span ${({ s }) => s};
  }

  ${({ theme }) => theme.mediaQueries.mobile} {
    grid-column: span ${({ xs }) => xs};
  }
`;

exports.GridItem = GridItem;


/***/ }),

/***/ 8066:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = __webpack_require__(85893);
const Flex = __webpack_require__(90291);

const ActionLayout = ({ startActions, endActions }) => {
    if (!startActions && !endActions) {
        return null;
    }
    return (jsxRuntime.jsxs(Flex.Flex, { justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 4, paddingLeft: 10, paddingRight: 10, children: [jsxRuntime.jsx(Flex.Flex, { gap: 2, wrap: "wrap", children: startActions }), jsxRuntime.jsx(Flex.Flex, { gap: 2, shrink: 0, wrap: "wrap", children: endActions })] }));
};

exports.ActionLayout = ActionLayout;


/***/ }),

/***/ 69786:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = __webpack_require__(85893);
const Box = __webpack_require__(60665);

const ContentLayout = ({ children }) => {
    return (jsxRuntime.jsx(Box.Box, { paddingLeft: 10, paddingRight: 10, children: children }));
};

exports.ContentLayout = ContentLayout;


/***/ }),

/***/ 12283:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const styled = __webpack_require__(88972);

const _interopDefault = e => e && e.__esModule ? e : { default: e };

const styled__default = /*#__PURE__*/_interopDefault(styled);

const GridLayout = styled__default.default.div `
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: ${({ theme }) => theme.spaces[4]};
`;

exports.GridLayout = GridLayout;


/***/ }),

/***/ 11756:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = __webpack_require__(85893);
const React = __webpack_require__(67294);
const styled = __webpack_require__(88972);
const useElementOnScreen = __webpack_require__(90082);
const useResizeObserver = __webpack_require__(30860);
const Box = __webpack_require__(60665);
const Flex = __webpack_require__(90291);
const Typography = __webpack_require__(4583);

const _interopDefault = e => e && e.__esModule ? e : { default: e };

const React__default = /*#__PURE__*/_interopDefault(React);
const styled__default = /*#__PURE__*/_interopDefault(styled);

const HeaderLayout = (props) => {
    const baseHeaderLayoutRef = React.useRef(null);
    const [headerSize, setHeaderSize] = React.useState(null);
    const [containerRef, isVisible] = useElementOnScreen.useElementOnScreen({
        root: null,
        rootMargin: '0px',
        threshold: 0,
    });
    useResizeObserver.useResizeObserver(containerRef, () => {
        if (containerRef.current) {
            setHeaderSize(containerRef.current.getBoundingClientRect());
        }
    });
    React.useEffect(() => {
        if (baseHeaderLayoutRef.current) {
            setHeaderSize(baseHeaderLayoutRef.current.getBoundingClientRect());
        }
    }, [baseHeaderLayoutRef]);
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx("div", { style: { height: headerSize?.height }, ref: containerRef, children: isVisible && jsxRuntime.jsx(BaseHeaderLayout, { ref: baseHeaderLayoutRef, ...props }) }), !isVisible && jsxRuntime.jsx(BaseHeaderLayout, { ...props, sticky: true, width: headerSize?.width })] }));
};
HeaderLayout.displayName = 'HeaderLayout';
const StickyBox = styled__default.default(Box.Box) `
  width: ${({ width }) => (width ? `${width / 16}rem` : undefined)};
  z-index: ${({ theme }) => theme.zIndices[1]};
`;
const BaseHeaderLayout = React__default.default.forwardRef(({ navigationAction, primaryAction, secondaryAction, subtitle, title, sticky, width, ...props }, ref) => {
    const isSubtitleString = typeof subtitle === 'string';
    if (sticky) {
        return (jsxRuntime.jsx(StickyBox, { paddingLeft: 6, paddingRight: 6, paddingTop: 3, paddingBottom: 3, position: "fixed", top: 0, right: 0, background: "neutral0", shadow: "tableShadow", width: width, "data-strapi-header-sticky": true, children: jsxRuntime.jsxs(Flex.Flex, { justifyContent: "space-between", children: [jsxRuntime.jsxs(Flex.Flex, { children: [navigationAction && jsxRuntime.jsx(Box.Box, { paddingRight: 3, children: navigationAction }), jsxRuntime.jsxs(Box.Box, { children: [jsxRuntime.jsx(Typography.Typography, { variant: "beta", as: "h1", ...props, children: title }), isSubtitleString ? (jsxRuntime.jsx(Typography.Typography, { variant: "pi", textColor: "neutral600", children: subtitle })) : (subtitle)] }), secondaryAction ? jsxRuntime.jsx(Box.Box, { paddingLeft: 4, children: secondaryAction }) : null] }), jsxRuntime.jsx(Flex.Flex, { children: primaryAction ? jsxRuntime.jsx(Box.Box, { paddingLeft: 2, children: primaryAction }) : undefined })] }) }));
    }
    return (jsxRuntime.jsxs(Box.Box, { ref: ref, paddingLeft: 10, paddingRight: 10, paddingBottom: 8, paddingTop: navigationAction ? 6 : 8, background: "neutral100", "data-strapi-header": true, children: [navigationAction ? jsxRuntime.jsx(Box.Box, { paddingBottom: 2, children: navigationAction }) : null, jsxRuntime.jsxs(Flex.Flex, { justifyContent: "space-between", children: [jsxRuntime.jsxs(Flex.Flex, { minWidth: 0, children: [jsxRuntime.jsx(Typography.Typography, { as: "h1", variant: "alpha", ...props, children: title }), secondaryAction ? jsxRuntime.jsx(Box.Box, { paddingLeft: 4, children: secondaryAction }) : null] }), primaryAction] }), isSubtitleString ? (jsxRuntime.jsx(Typography.Typography, { variant: "epsilon", textColor: "neutral600", as: "p", children: subtitle })) : (subtitle)] }));
});

exports.BaseHeaderLayout = BaseHeaderLayout;
exports.HeaderLayout = HeaderLayout;


/***/ }),

/***/ 68:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = __webpack_require__(85893);
const styled = __webpack_require__(88972);
const Box = __webpack_require__(60665);

const _interopDefault = e => e && e.__esModule ? e : { default: e };

const styled__default = /*#__PURE__*/_interopDefault(styled);

const GridContainer = styled__default.default(Box.Box) `
  display: grid;
  grid-template-columns: ${({ hasSideNav }) => (hasSideNav ? `auto 1fr` : '1fr')};
`;
const OverflowingItem = styled__default.default(Box.Box) `
  overflow-x: hidden;
`;
const Layout = ({ sideNav, children }) => {
    return (jsxRuntime.jsxs(GridContainer, { hasSideNav: Boolean(sideNav), children: [sideNav, jsxRuntime.jsx(OverflowingItem, { paddingBottom: 10, children: children })] }));
};

exports.Layout = Layout;


/***/ }),

/***/ 93070:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = __webpack_require__(85893);
const Grid = __webpack_require__(35063);
const GridItem = __webpack_require__(91259);
const Box = __webpack_require__(60665);

const TwoColsLayout = ({ startCol, endCol }) => {
    return (jsxRuntime.jsxs(Grid.Grid, { gap: 4, children: [jsxRuntime.jsx(GridItem.GridItem, { col: 9, s: 12, children: jsxRuntime.jsx(Box.Box, { hasRadius: true, background: "neutral0", shadow: "tableShadow", children: startCol }) }), jsxRuntime.jsx(GridItem.GridItem, { col: 3, s: 12, children: jsxRuntime.jsx(Box.Box, { hasRadius: true, background: "neutral0", shadow: "tableShadow", children: endCol }) })] }));
};

exports.TwoColsLayout = TwoColsLayout;


/***/ }),

/***/ 58136:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const Layout = __webpack_require__(68);
const ActionLayout = __webpack_require__(8066);
const ContentLayout = __webpack_require__(69786);
const HeaderLayout = __webpack_require__(11756);
const TwoColsLayout = __webpack_require__(93070);
const GridLayout = __webpack_require__(12283);



exports.Layout = Layout.Layout;
exports.ActionLayout = ActionLayout.ActionLayout;
exports.ContentLayout = ContentLayout.ContentLayout;
exports.BaseHeaderLayout = HeaderLayout.BaseHeaderLayout;
exports.HeaderLayout = HeaderLayout.HeaderLayout;
exports.TwoColsLayout = TwoColsLayout.TwoColsLayout;
exports.GridLayout = GridLayout.GridLayout;


/***/ }),

/***/ 94051:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = __webpack_require__(85893);
const React = __webpack_require__(67294);
const useId = __webpack_require__(24414);
const Field = __webpack_require__(58674);
const Flex = __webpack_require__(90291);
const FieldLabel = __webpack_require__(64919);
const FieldInput = __webpack_require__(30969);
const FieldHint = __webpack_require__(92298);
const FieldError = __webpack_require__(73582);

const TextInput = React.forwardRef(({ name, hint, error, label, labelAction, id, required, ...props }, ref) => {
    const generatedId = useId.useId(id);
    const inputWrapperRef = React.useRef(null);
    const inputRef = React.useRef(null);
    if (!label && !props['aria-label']) {
        throw new Error('The TextInput component needs a "label" or an "aria-label" props');
    }
    /**
     * TODO: for V2, remove this.
     */
    React.useImperativeHandle(ref, () => ({
        input: inputRef,
        inputWrapperRef,
    }), []);
    return (jsxRuntime.jsx("div", { ref: inputWrapperRef, children: jsxRuntime.jsx(Field.Field, { name: name, hint: hint, error: error, id: generatedId, required: required, children: jsxRuntime.jsxs(Flex.Flex, { direction: "column", alignItems: "stretch", gap: 1, children: [label && jsxRuntime.jsx(FieldLabel.FieldLabel, { action: labelAction, children: label }), jsxRuntime.jsx(FieldInput.FieldInput, { ref: inputRef, ...props }), jsxRuntime.jsx(FieldHint.FieldHint, {}), jsxRuntime.jsx(FieldError.FieldError, {})] }) }) }));
});
TextInput.displayName = 'TextInput';

exports.TextInput = TextInput;


/***/ }),

/***/ 49006:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const TextInput = __webpack_require__(94051);



exports.TextInput = TextInput.TextInput;


/***/ }),

/***/ 4583:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const styled = __webpack_require__(88972);
const utils = __webpack_require__(50933);
const theme = __webpack_require__(60468);

const _interopDefault = e => e && e.__esModule ? e : { default: e };

const styled__default = /*#__PURE__*/_interopDefault(styled);

const transientProps = {
    fontSize: true,
    fontWeight: true,
};
const Typography = styled__default.default.span.withConfig({
    shouldForwardProp: (prop, defPropValFN) => !transientProps[prop] && defPropValFN(prop),
}) `
  ${utils.variantStyle}
  ${utils.ellipsisStyle}

  // These properties need to come after {variantStyle}, because they might
  // overwrite a variant attribute
  font-weight: ${({ theme: theme$1, fontWeight }) => theme.extractStyleFromTheme(theme$1.fontWeights, fontWeight, undefined)};
  font-size: ${({ theme: theme$1, fontSize }) => theme.extractStyleFromTheme(theme$1.fontSizes, fontSize, undefined)};
  line-height: ${({ theme: theme$1, lineHeight }) => theme.extractStyleFromTheme(theme$1.lineHeights, lineHeight, lineHeight)};
  color: ${({ theme, textColor }) => theme.colors[textColor || 'neutral800']};
  text-align: ${({ textAlign }) => textAlign};
  text-decoration: ${({ textDecoration }) => textDecoration};
  text-transform: ${({ textTransform }) => textTransform};
`;

exports.Typography = Typography;


/***/ }),

/***/ 24866:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const ALPHA = 'alpha';
const BETA = 'beta';
const DELTA = 'delta';
const EPSILON = 'epsilon';
const OMEGA = 'omega';
const PI = 'pi';
const SIGMA = 'sigma';
const TEXT_VARIANTS = [ALPHA, BETA, DELTA, EPSILON, OMEGA, PI, SIGMA];

exports.ALPHA = ALPHA;
exports.BETA = BETA;
exports.DELTA = DELTA;
exports.EPSILON = EPSILON;
exports.OMEGA = OMEGA;
exports.PI = PI;
exports.SIGMA = SIGMA;
exports.TEXT_VARIANTS = TEXT_VARIANTS;


/***/ }),

/***/ 84704:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const Typography = __webpack_require__(4583);



exports.Typography = Typography.Typography;


/***/ }),

/***/ 50933:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const constants = __webpack_require__(24866);

const ellipsisStyle = ({ ellipsis = false }) => ellipsis &&
    `
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `;
const variantStyle = ({ variant = constants.OMEGA, theme, }) => {
    switch (variant) {
        case constants.ALPHA: {
            return `
        font-weight: ${theme.fontWeights.bold};
        font-size: ${theme.fontSizes[5]};
        line-height: ${theme.lineHeights[2]};
      `;
        }
        case constants.BETA: {
            return `
        font-weight: ${theme.fontWeights.bold};
        font-size: ${theme.fontSizes[4]};
        line-height: ${theme.lineHeights[1]};
      `;
        }
        case constants.DELTA: {
            return `
        font-weight: ${theme.fontWeights.semiBold};
        font-size: ${theme.fontSizes[3]};
        line-height: ${theme.lineHeights[2]};
      `;
        }
        case constants.EPSILON: {
            return `
        font-size: ${theme.fontSizes[3]};
        line-height: ${theme.lineHeights[6]};
      `;
        }
        case constants.OMEGA: {
            return `
        font-size: ${theme.fontSizes[2]};
        line-height: ${theme.lineHeights[4]};
      `;
        }
        case constants.PI: {
            return `
        font-size: ${theme.fontSizes[1]};
        line-height: ${theme.lineHeights[3]};
      `;
        }
        case constants.SIGMA: {
            return `
        font-weight: ${theme.fontWeights.bold};
        font-size: ${theme.fontSizes[0]};
        line-height: ${theme.lineHeights[5]};
        text-transform: uppercase;
      `;
        }
        default: {
            return `
        font-size: ${theme.fontSizes[2]};
      `;
        }
    }
};

exports.ellipsisStyle = ellipsisStyle;
exports.variantStyle = variantStyle;


/***/ }),

/***/ 52075:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const PREFIX = '[@strapi/design-system]:';
const once = (fn) => {
    const func = fn;
    let called = false;
    if (typeof func !== 'function') {
        throw new TypeError(`${PREFIX} once requires a function parameter`);
    }
    return (...args) => {
        if (!called) {
            func(...args);
            called = true;
        }
    };
};

exports.PREFIX = PREFIX;
exports.once = once;


/***/ }),

/***/ 91554:
/***/ ((module) => {



/* eslint-disable consistent-return */
const handleResponsiveValues = (property, value, theme) => {
    if (!value) {
        return undefined;
    }
    if (typeof value === 'object') {
        const transformedArray = Array.isArray(value)
            ? value
            : [value?.desktop, value?.tablet, value?.mobile];
        const spaces = transformedArray.reduce((acc, curr, index) => {
            if (curr) {
                switch (index) {
                    case 0:
                        return `${acc}${property}: ${theme.spaces[curr]};`;
                    case 1:
                        return `${acc}${theme.mediaQueries.tablet}{${property}: ${theme.spaces[curr]};}`;
                    case 2:
                        return `${acc}${theme.mediaQueries.mobile}{${property}: ${theme.spaces[curr]};}`;
                    default:
                        return acc;
                }
            }
            return acc;
        }, '');
        return spaces;
    }
    // Fallback to the passed transformedArray when necessary
    const realValue = theme.spaces[value] ?? value;
    return `${property}: ${realValue};`;
};

module.exports = handleResponsiveValues;


/***/ }),

/***/ 79511:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

function isKeyOf(o, s) {
    if (typeof o === 'string') {
        return false;
    }
    return s in o;
}
/**
 * @description Simple object check.
 * @export
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

exports.isKeyOf = isKeyOf;
exports.isObject = isObject;


/***/ }),

/***/ 60468:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const objects = __webpack_require__(79511);

function extractStyleFromTheme(themeSection, key, defaultValue) {
    if (key && objects.isKeyOf(themeSection, key)) {
        return themeSection[key];
    }
    return defaultValue;
}

exports.extractStyleFromTheme = extractStyleFromTheme;


/***/ }),

/***/ 90082:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const React = __webpack_require__(67294);

const useElementOnScreen = (options) => {
    const containerRef = React.useRef(null);
    const [isVisible, setIsVisible] = React.useState(true);
    const callback = ([entry]) => {
        setIsVisible(entry.isIntersecting);
    };
    React.useEffect(() => {
        const containerEl = containerRef.current;
        const observer = new IntersectionObserver(callback, options);
        if (containerEl) {
            observer.observe(containerRef.current);
        }
        return () => {
            if (containerEl) {
                observer.disconnect();
            }
        };
    }, [containerRef, options]);
    return [containerRef, isVisible];
};

exports.useElementOnScreen = useElementOnScreen;


/***/ }),

/***/ 24414:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const React = __webpack_require__(67294);

const _interopDefault = e => e && e.__esModule ? e : { default: e };

const React__default = /*#__PURE__*/_interopDefault(React);

// Inspired by radix-ui useId hook https://github.com/radix-ui/primitives/blob/main/packages/react/id/src/id.tsx
// We `toString()` to prevent bundlers from trying to `import { useId } from 'react';`
const useReactId = React__default.default['useId'.toString()] || (() => undefined);
let count = 0;
const useId = (initialId) => {
    const [id, setId] = React.useState(useReactId());
    // React versions older than 18 will have client-side ids only.
    React.useLayoutEffect(() => {
        if (!initialId)
            setId((reactId) => reactId ?? String(count++));
    }, [initialId]);
    return initialId?.toString() ?? (id || '');
};

exports.useId = useId;


/***/ }),

/***/ 30860:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const React = __webpack_require__(67294);
const uiPrimitives = __webpack_require__(61299);

const useResizeObserver = (sources, onResize) => {
    const handleResize = uiPrimitives.useCallbackRef(onResize);
    React.useLayoutEffect(() => {
        const resizeObs = new ResizeObserver(handleResize);
        if (Array.isArray(sources)) {
            sources.forEach((source) => {
                if (source.current) {
                    resizeObs.observe(source.current);
                }
            });
        }
        else if (sources.current) {
            resizeObs.observe(sources.current);
        }
        return () => {
            resizeObs.disconnect();
        };
    }, [sources, handleResize]);
};

exports.useResizeObserver = useResizeObserver;


/***/ }),

/***/ 69186:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const styled = __webpack_require__(88972);

const getThemeSize = (type) => {
    return ({ theme, size }) => theme.sizes[type][size];
};
const inputFocusStyle = (rootElement = '&') => ({ theme, hasError = false }) => styled.css `
    outline: none;
    box-shadow: 0;
    transition-property: border-color, box-shadow, fill;
    transition-duration: 0.2s;

    ${rootElement}:focus-within {
      border: 1px solid ${hasError ? theme.colors.danger600 : theme.colors.primary600};
      box-shadow: ${hasError ? theme.colors.danger600 : theme.colors.primary600} 0px 0px 0px 2px;
    }
  `;
const buttonFocusStyle = ({ theme }) => styled.css `
  position: relative;
  outline: none;

  &:after {
    transition-property: all;
    transition-duration: 0.2s;
    border-radius: 8px;
    content: '';
    position: absolute;
    top: -4px;
    bottom: -4px;
    left: -4px;
    right: -4px;
    border: 2px solid transparent;
  }

  &:focus-visible {
    outline: none;
    &:after {
      border-radius: 8px;
      content: '';
      position: absolute;
      top: -5px;
      bottom: -5px;
      left: -5px;
      right: -5px;
      border: 2px solid ${theme.colors.primary600};
    }
  }
`;

exports.buttonFocusStyle = buttonFocusStyle;
exports.getThemeSize = getThemeSize;
exports.inputFocusStyle = inputFocusStyle;


/***/ }),

/***/ 88604:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ pages_App)
});

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(67294);
// EXTERNAL MODULE: ./node_modules/react-router/esm/react-router.js
var react_router = __webpack_require__(16550);
// EXTERNAL MODULE: ./node_modules/@strapi/helper-plugin/dist/index.mjs + 62 modules
var dist = __webpack_require__(27873);
// EXTERNAL MODULE: ./node_modules/strapi-wechat-miniprogram-auth/admin/src/pluginId.js
var pluginId = __webpack_require__(6358);
// EXTERNAL MODULE: ./node_modules/react-intl/lib/src/components/useIntl.js
var useIntl = __webpack_require__(86896);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Box/Box.mjs
var Box = __webpack_require__(16607);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/LinkButton/LinkButton.mjs
var LinkButton = __webpack_require__(4745);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Flex/Flex.mjs
var Flex = __webpack_require__(96987);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Button/Button.mjs
var Button = __webpack_require__(12473);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Layout/index.js
var Layout = __webpack_require__(58136);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Typography/index.js
var Typography = __webpack_require__(84704);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/TextInput/index.js
var TextInput = __webpack_require__(49006);
// EXTERNAL MODULE: ./node_modules/@strapi/icons/dist/Plus.mjs
var Plus = __webpack_require__(83598);
// EXTERNAL MODULE: ./node_modules/@strapi/icons/dist/Write.mjs
var Write = __webpack_require__(69896);
// EXTERNAL MODULE: ./node_modules/@strapi/icons/dist/Lock.mjs
var Lock = __webpack_require__(46759);
// EXTERNAL MODULE: ./node_modules/axios/lib/axios.js + 40 modules
var axios = __webpack_require__(52861);
;// CONCATENATED MODULE: ./node_modules/strapi-wechat-miniprogram-auth/admin/src/utils/axiosInstance.js


const instance = axios["default"].create({
  baseURL: ""
});
instance.interceptors.request.use(
  async (config) => {
    config.headers = {
      Authorization: `Bearer ${dist/* auth */.I8.getToken()}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    };
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      dist/* auth */.I8.clearAppStorage();
      window.location.reload();
    }
    throw error;
  }
);
/* harmony default export */ const axiosInstance = (instance);

;// CONCATENATED MODULE: ./node_modules/strapi-wechat-miniprogram-auth/admin/src/utils/getTrad.js

const getTrad = (id) => `${pluginId/* default */.Z}.${id}`;
/* harmony default export */ const utils_getTrad = (getTrad);

;// CONCATENATED MODULE: ./node_modules/strapi-wechat-miniprogram-auth/admin/src/utils/index.js


;// CONCATENATED MODULE: ./node_modules/strapi-wechat-miniprogram-auth/admin/src/pages/HomePage/index.js











const HomePage = () => {
  const { formatMessage } = (0,useIntl/* default */.Z)();
  const [creds, setCreds] = (0,react.useState)({
    app_id: "",
    app_secret: ""
  });
  const [saving, setSaving] = (0,react.useState)(false);
  const [editable, setEditable] = (0,react.useState)(true);
  function handleAppID(app_id) {
    setCreds({
      app_id,
      app_secret: creds.app_secret
    });
  }
  function handleAppSecret(app_secret) {
    setCreds({
      app_id: creds.app_id,
      app_secret
    });
  }
  async function fetchData() {
    try {
      const { data } = await axiosInstance.get(`/${pluginId/* default */.Z}/credentials`);
      setCreds({
        app_id: data.app_id ? data.app_id : "",
        app_secret: data.app_secret ? data.app_secret : ""
      });
      if (data) {
        if (data.app_id && data.app_secret) {
          setEditable(false);
        } else {
          setEditable(true);
        }
      } else {
        setEditable(true);
      }
    } catch (error) {
      console.log(error);
      setCreds({
        app_id: "",
        app_secret: ""
      });
      setEditable(true);
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    setSaving(true);
    try {
      await axiosInstance.post(`/${pluginId/* default */.Z}/credentials/add`, {
        app_id: creds.app_id,
        app_secret: creds.app_secret
      });
      await fetchData();
      setSaving(false);
    } catch (error) {
      setSaving(false);
    }
  }
  function handleEdit(e) {
    e.preventDefault();
    e.stopPropagation();
    setEditable(true);
  }
  (0,react.useEffect)(() => {
    fetchData();
  }, []);
  return /* @__PURE__ */ react.createElement("div", null, /* @__PURE__ */ react.createElement(Box/* Box */.x, { padding: 8, background: "primary100" }, /* @__PURE__ */ react.createElement(
    Layout.BaseHeaderLayout,
    {
      primaryAction: /* @__PURE__ */ react.createElement(LinkButton/* LinkButton */.Q, { startIcon: /* @__PURE__ */ react.createElement(Plus/* default */.Z, null), size: "L", variant: "default", href: "https://mp.weixin.qq.com/cgi-bin/wx" }, formatMessage({
        id: utils_getTrad("Header.create.msg"),
        defaultMessage: "Create WeChat Mini Program"
      })),
      title: formatMessage({
        id: utils_getTrad("Header.title"),
        defaultMessage: "WeChat Mini Program Authenticator"
      }),
      subtitle: "By wfzong.",
      as: "h2"
    }
  )), /* @__PURE__ */ react.createElement(Box/* Box */.x, { padding: 8, background: "neutral100" }, /* @__PURE__ */ react.createElement(Box/* Box */.x, { padding: 4 }, /* @__PURE__ */ react.createElement(Typography.Typography, { variant: "beta" }, formatMessage({
    id: utils_getTrad("Form.title"),
    defaultMessage: "Add/Update your WeChat Mini Program Details."
  }))), /* @__PURE__ */ react.createElement(Layout.GridLayout, null, /* @__PURE__ */ react.createElement(Box/* Box */.x, { padding: 4, hasRadius: true, background: "neutral0", shadow: "tableShadow" }, /* @__PURE__ */ react.createElement(
    TextInput.TextInput,
    {
      required: true,
      disabled: !editable,
      placeholder: formatMessage({
        id: utils_getTrad("Form.input.appid.placeholder"),
        defaultMessage: "Please input your AppID"
      }),
      label: formatMessage({
        id: utils_getTrad("Form.input.appid.label"),
        defaultMessage: "WeChat Mini Program AppID"
      }),
      name: "AppID",
      onChange: (e) => handleAppID(e.target.value),
      value: creds.app_id
    }
  )), /* @__PURE__ */ react.createElement(Box/* Box */.x, { padding: 4, hasRadius: true, background: "neutral0", shadow: "tableShadow" }, /* @__PURE__ */ react.createElement(
    TextInput.TextInput,
    {
      required: true,
      type: "password",
      disabled: !editable,
      placeholder: formatMessage({
        id: utils_getTrad("Form.input.app_secret.placeholder"),
        defaultMessage: "Please input your AppSecret"
      }),
      label: formatMessage({
        id: utils_getTrad("Form.input.app_secret.label"),
        defaultMessage: "WeChat Mini Program AppSecret"
      }),
      name: "AppSecret",
      hint: formatMessage({
        id: utils_getTrad("Form.input.app_secret.hint"),
        defaultMessage: "Available in your Mini Program project dev panel"
      }),
      onChange: (e) => handleAppSecret(e.target.value),
      value: creds.app_secret
    }
  ))), /* @__PURE__ */ react.createElement(Flex/* Flex */.k, { marginTop: 4, justifyContent: "space-between" }, /* @__PURE__ */ react.createElement(
    Button/* Button */.z,
    {
      disabled: editable,
      onClick: handleEdit,
      size: "L",
      endIcon: /* @__PURE__ */ react.createElement(Write/* default */.Z, null),
      variant: "secondary"
    },
    formatMessage({
      id: utils_getTrad("edit.msg"),
      defaultMessage: "Edit"
    })
  ), /* @__PURE__ */ react.createElement(
    Button/* Button */.z,
    {
      disabled: !editable,
      loading: saving,
      onClick: handleSubmit,
      size: "L",
      endIcon: /* @__PURE__ */ react.createElement(Lock/* default */.Z, null),
      variant: "default"
    },
    formatMessage({
      id: utils_getTrad("save.msg"),
      defaultMessage: "Save Credentials"
    })
  ))));
};
/* harmony default export */ const pages_HomePage = ((0,react.memo)(HomePage));

;// CONCATENATED MODULE: ./node_modules/strapi-wechat-miniprogram-auth/admin/src/pages/App/index.js





const App = () => {
  return /* @__PURE__ */ react.createElement("div", null, /* @__PURE__ */ react.createElement(react_router/* Switch */.rs, null, /* @__PURE__ */ react.createElement(react_router/* Route */.AW, { path: `/plugins/${pluginId/* default */.Z}`, component: pages_HomePage, exact: true }), /* @__PURE__ */ react.createElement(react_router/* Route */.AW, { component: dist.NotFound })));
};
/* harmony default export */ const pages_App = (App);


/***/ }),

/***/ 4745:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Q: () => (/* binding */ LinkButton)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(85893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(67294);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(73727);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(88972);
/* harmony import */ var _Button_utils_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(62485);
/* harmony import */ var _BaseButton_BaseButton_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(20501);
/* harmony import */ var _Flex_Flex_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(96987);
/* harmony import */ var _Typography_Typography_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(10574);









const LinkWrapper = (0,styled_components__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_BaseButton_BaseButton_mjs__WEBPACK_IMPORTED_MODULE_3__/* .BaseButtonWrapper */ .G)) `
  &[aria-disabled='true'] {
    ${_Button_utils_mjs__WEBPACK_IMPORTED_MODULE_4__/* .getDisabledStyle */ .sg}
    &:active {
      ${_Button_utils_mjs__WEBPACK_IMPORTED_MODULE_4__/* .getDisabledStyle */ .sg}
    }
  }
  &:hover {
    ${_Button_utils_mjs__WEBPACK_IMPORTED_MODULE_4__/* .getHoverStyle */ .yP}
  }
  &:active {
    ${_Button_utils_mjs__WEBPACK_IMPORTED_MODULE_4__/* .getActiveStyle */ .tB}
  }
  ${_Button_utils_mjs__WEBPACK_IMPORTED_MODULE_4__/* .getVariantStyle */ .PD}
`;
const LinkButton = react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({ variant = 'default', startIcon, endIcon, disabled = false, children, size = 'S', href, to, ...props }, ref) => {
    const target = href ? '_blank' : undefined;
    const rel = href ? 'noreferrer noopener' : undefined;
    const paddingX = size === 'S' ? 2 : '10px';
    const paddingY = 4;
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(LinkWrapper, { ref: ref, "aria-disabled": disabled, size: size, variant: variant, target: target, rel: rel, to: disabled ? undefined : to, href: disabled ? '#' : href, background: "buttonPrimary600", borderColor: "buttonPrimary600", hasRadius: true, gap: 2, inline: true, paddingBottom: paddingX, paddingLeft: paddingY, paddingRight: paddingY, paddingTop: paddingX, pointerEvents: disabled ? 'none' : undefined, ...props, as: to && !disabled ? react_router_dom__WEBPACK_IMPORTED_MODULE_5__/* .NavLink */ .OL : 'a', children: [startIcon && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Flex_Flex_mjs__WEBPACK_IMPORTED_MODULE_6__/* .Flex */ .k, { "aria-hidden": true, children: startIcon }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Typography_Typography_mjs__WEBPACK_IMPORTED_MODULE_7__/* .Typography */ .Z, { variant: size === 'S' ? 'pi' : undefined, fontWeight: "bold", textColor: "buttonNeutral0", children: children }), endIcon && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Flex_Flex_mjs__WEBPACK_IMPORTED_MODULE_6__/* .Flex */ .k, { "aria-hidden": true, children: endIcon })] }));
});




/***/ }),

/***/ 46759:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ a)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(85893);

const t = (o) => /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", width: "1rem", height: "1rem", fill: "none", viewBox: "0 0 24 24", ...o, children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
  "path",
  {
    fill: "#8E8EA9",
    d: "M19 10h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1V9a7 7 0 0 1 14 0v1Zm-2 0V9A5 5 0 0 0 7 9v1h10Zm-6 4v4h2v-4h-2Z"
  }
) }), a = t;



/***/ }),

/***/ 69896:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ v)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(85893);

const l = (e) => /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", width: "1rem", height: "1rem", fill: "none", viewBox: "0 0 24 24", ...e, children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
  "path",
  {
    fill: "#212134",
    fillRule: "evenodd",
    d: "M23.707.297A1 1 0 0 0 23 .004h-2a13.907 13.907 0 0 0-5.38 1.077 1 1 0 0 0-.615.923V4.92a.035.035 0 0 1-.022.038l-2-1.47a1 1 0 0 0-1.265.052A14 14 0 0 0 7 14.004v1.585l-2.707 2.707a1 1 0 1 0 1.415 1.415l2.707-2.708H10a14.014 14.014 0 0 0 14-14v-2a1 1 0 0 0-.293-.706ZM18 23.999H3a3 3 0 0 1-3-3V6A3 3 0 0 1 3 3h3a1 1 0 1 1 0 2H3a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1v-3a1 1 0 1 1 2 0v3a3 3 0 0 1-3 3Z",
    clipRule: "evenodd"
  }
) }), v = l;



/***/ })

}]);