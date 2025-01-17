"use strict";
(self["webpackChunkapi_stamped_app"] = self["webpackChunkapi_stamped_app"] || []).push([[5516],{

/***/ 75286:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   N: () => (/* binding */ useDebounce)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67294);

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = react__WEBPACK_IMPORTED_MODULE_0__.useState(value);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}


/***/ }),

/***/ 9117:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  MarketPlacePage: () => (/* binding */ MarketPlacePage),
  "default": () => (/* binding */ MarketplacePage)
});

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(67294);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Layout/Layout.mjs
var Layout = __webpack_require__(71590);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Main/Main.mjs
var Main = __webpack_require__(40720);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Layout/ContentLayout.mjs
var ContentLayout = __webpack_require__(34726);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Tabs/TabGroup.mjs
var TabGroup = __webpack_require__(98948);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Flex/Flex.mjs
var Flex = __webpack_require__(96987);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Tabs/Tabs.mjs + 1 modules
var Tabs = __webpack_require__(91788);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Box/Box.mjs
var Box = __webpack_require__(16607);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Searchbar/Searchbar.mjs
var Searchbar = __webpack_require__(35987);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Tabs/TabPanels.mjs
var TabPanels = __webpack_require__(94955);
// EXTERNAL MODULE: ./node_modules/@strapi/helper-plugin/dist/index.mjs + 62 modules
var dist = __webpack_require__(27873);
// EXTERNAL MODULE: ./node_modules/react-helmet/es/Helmet.js
var Helmet = __webpack_require__(64593);
// EXTERNAL MODULE: ./node_modules/react-intl/lib/src/components/useIntl.js
var useIntl = __webpack_require__(86896);
// EXTERNAL MODULE: ./node_modules/react-redux/es/index.js + 21 modules
var es = __webpack_require__(86706);
// EXTERNAL MODULE: ./.cache/admin/src/hooks/useDebounce.ts
var useDebounce = __webpack_require__(75286);
// EXTERNAL MODULE: ./.cache/admin/src/pages/App/selectors.js
var selectors = __webpack_require__(36364);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Icon/Icon.mjs
var Icon = __webpack_require__(85200);
// EXTERNAL MODULE: ./node_modules/@strapi/icons/dist/GlassesSquare.mjs
var GlassesSquare = __webpack_require__(94573);
// EXTERNAL MODULE: ./node_modules/@strapi/icons/dist/ExternalLink.mjs
var ExternalLink = __webpack_require__(62577);
;// CONCATENATED MODULE: ./.cache/admin/src/pages/MarketplacePage/components/MissingPluginBanner/index.js





const MissingPluginBanner = () => {
  const { formatMessage } = (0,useIntl/* default */.Z)();
  const { trackUsage } = (0,dist/* useTracking */.rS)();
  return /* @__PURE__ */ react.createElement(
    "a",
    {
      href: "https://strapi.canny.io/plugin-requests",
      target: "_blank",
      rel: "noopener noreferrer nofollow",
      style: { textDecoration: "none" },
      onClick: () => trackUsage("didMissMarketplacePlugin")
    },
    /* @__PURE__ */ react.createElement(
      dist/* ContentBox */.Y_,
      {
        title: formatMessage({
          id: "admin.pages.MarketPlacePage.missingPlugin.title",
          defaultMessage: "Documentation"
        }),
        subtitle: formatMessage({
          id: "admin.pages.MarketPlacePage.missingPlugin.description",
          defaultMessage: "Tell us what plugin you are looking for and we'll let our community plugin developers know in case they are in search for inspiration!"
        }),
        icon: /* @__PURE__ */ react.createElement(GlassesSquare/* default */.Z, null),
        iconBackground: "alternative100",
        endAction: /* @__PURE__ */ react.createElement(Icon/* Icon */.J, { as: ExternalLink/* default */.Z, color: "neutral600", width: 3, height: 3, marginLeft: 2 })
      }
    )
  );
};
/* harmony default export */ const components_MissingPluginBanner = (MissingPluginBanner);

// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Tag/Tag.mjs
var Tag = __webpack_require__(96724);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Button/Button.mjs
var Button = __webpack_require__(12473);
// EXTERNAL MODULE: ./node_modules/@strapi/icons/dist/Cross.mjs
var Cross = __webpack_require__(35771);
// EXTERNAL MODULE: ./node_modules/@strapi/icons/dist/Filter.mjs
var Filter = __webpack_require__(52933);
// EXTERNAL MODULE: ./node_modules/prop-types/index.js
var prop_types = __webpack_require__(45697);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);
// EXTERNAL MODULE: ./node_modules/styled-components/dist/styled-components.browser.esm.js + 4 modules
var styled_components_browser_esm = __webpack_require__(88972);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Popover/Popover.mjs
var Popover = __webpack_require__(59604);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Select/Select.mjs
var Select = __webpack_require__(59586);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Select/Option.mjs
var Option = __webpack_require__(40933);
;// CONCATENATED MODULE: ./.cache/admin/src/pages/MarketplacePage/components/NpmPackagesFilters/FilterSelect.js



const FilterSelect = ({ message, value, onChange, possibleFilters, onClear, customizeContent }) => {
  const computeFilterMessage = (filterName, count) => {
    return `${filterName} (${count})`;
  };
  return /* @__PURE__ */ react.createElement(
    Select/* Select */.P,
    {
      "data-testid": `${message}-button`,
      label: message,
      placeholder: message,
      size: "M",
      onChange,
      onClear,
      value,
      customizeContent,
      multi: true
    },
    Object.entries(possibleFilters).map(([filterName, count]) => {
      return /* @__PURE__ */ react.createElement(Option/* Option */.W, { "data-testid": `${filterName}-${count}`, key: filterName, value: filterName }, computeFilterMessage(filterName, count));
    })
  );
};
FilterSelect.propTypes = {
  message: (prop_types_default()).string.isRequired,
  value: (prop_types_default()).array.isRequired,
  onChange: (prop_types_default()).func.isRequired,
  possibleFilters: (prop_types_default()).object.isRequired,
  onClear: (prop_types_default()).func.isRequired,
  customizeContent: (prop_types_default()).func.isRequired
};
/* harmony default export */ const NpmPackagesFilters_FilterSelect = (FilterSelect);

;// CONCATENATED MODULE: ./.cache/admin/src/pages/MarketplacePage/components/NpmPackagesFilters/FiltersPopover.js






const FiltersPopover = ({
  source,
  onToggle,
  query,
  npmPackageType,
  possibleCategories,
  possibleCollections,
  handleSelectChange,
  handleSelectClear
}) => {
  const { formatMessage } = (0,useIntl/* default */.Z)();
  return /* @__PURE__ */ react.createElement(Popover/* Popover */.J2, { source, onDismiss: onToggle, padding: 3, spacing: 4 }, /* @__PURE__ */ react.createElement(FiltersFlex, { direction: "column", alignItems: "stretch", gap: 1 }, /* @__PURE__ */ react.createElement(
    NpmPackagesFilters_FilterSelect,
    {
      message: formatMessage({
        id: "admin.pages.MarketPlacePage.filters.collections",
        defaultMessage: "Collections"
      }),
      value: query?.collections || [],
      onChange: (newCollections) => {
        const update = { collections: newCollections };
        handleSelectChange(update);
      },
      onClear: () => handleSelectClear("collections"),
      possibleFilters: possibleCollections,
      customizeContent: (values) => formatMessage(
        {
          id: "admin.pages.MarketPlacePage.filters.collectionsSelected",
          defaultMessage: "{count, plural, =0 {No collections} one {# collection} other {# collections}} selected"
        },
        { count: values.length }
      )
    }
  ), npmPackageType === "plugin" && /* @__PURE__ */ react.createElement(
    NpmPackagesFilters_FilterSelect,
    {
      message: formatMessage({
        id: "admin.pages.MarketPlacePage.filters.categories",
        defaultMessage: "Categories"
      }),
      value: query?.categories || [],
      onChange: (newCategories) => {
        const update = { categories: newCategories };
        handleSelectChange(update);
      },
      onClear: () => handleSelectClear("categories"),
      possibleFilters: possibleCategories,
      customizeContent: (values) => formatMessage(
        {
          id: "admin.pages.MarketPlacePage.filters.categoriesSelected",
          defaultMessage: "{count, plural, =0 {No categories} one {# category} other {# categories}} selected"
        },
        { count: values.length }
      ),
      name: "categories"
    }
  )));
};
FiltersPopover.propTypes = {
  onToggle: (prop_types_default()).func.isRequired,
  source: prop_types_default().shape({ current: prop_types_default().instanceOf(Element) }).isRequired,
  query: (prop_types_default()).object.isRequired,
  npmPackageType: prop_types_default().oneOf(["plugin", "provider"]).isRequired,
  possibleCollections: (prop_types_default()).object.isRequired,
  possibleCategories: (prop_types_default()).object.isRequired,
  handleSelectChange: (prop_types_default()).func.isRequired,
  handleSelectClear: (prop_types_default()).func.isRequired
};
/* harmony default export */ const NpmPackagesFilters_FiltersPopover = (FiltersPopover);
const FiltersFlex = (0,styled_components_browser_esm["default"])((0,Flex/* Flex */.k))`
  /* Hide the label, every input needs a label. */
  label {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }
`;

;// CONCATENATED MODULE: ./.cache/admin/src/pages/MarketplacePage/components/NpmPackagesFilters/index.js







const FilterTag = ({ name, handleRemove }) => {
  return /* @__PURE__ */ react.createElement(Box/* Box */.x, { padding: 1 }, /* @__PURE__ */ react.createElement(Tag/* Tag */.V, { icon: /* @__PURE__ */ react.createElement(Cross/* default */.Z, null), onClick: handleRemove }, name));
};
const ButtonToggle = (0,styled_components_browser_esm["default"])((0,Button/* Button */.z))`
  height: ${({ theme }) => theme.sizes.input.S};
`;
const NpmPackagesFilters = ({
  possibleCollections,
  possibleCategories,
  npmPackageType,
  query,
  handleSelectClear,
  handleSelectChange
}) => {
  const [isVisible, setIsVisible] = (0,react.useState)(false);
  const buttonRef = (0,react.useRef)();
  const { formatMessage } = (0,useIntl/* default */.Z)();
  const handleToggle = () => setIsVisible((prev) => !prev);
  const handleTagRemove = (tagToRemove, filterType) => {
    const update = {
      [filterType]: query[filterType].filter((previousTag) => previousTag !== tagToRemove)
    };
    handleSelectChange(update);
  };
  return /* @__PURE__ */ react.createElement(react.Fragment, null, /* @__PURE__ */ react.createElement(Box/* Box */.x, { paddingTop: 1, paddingBottom: 1 }, /* @__PURE__ */ react.createElement(
    ButtonToggle,
    {
      variant: "tertiary",
      ref: buttonRef,
      startIcon: /* @__PURE__ */ react.createElement(Filter/* default */.Z, null),
      onClick: handleToggle,
      size: "S"
    },
    formatMessage({ id: "app.utils.filters", defaultMessage: "Filters" })
  ), isVisible && /* @__PURE__ */ react.createElement(
    NpmPackagesFilters_FiltersPopover,
    {
      onToggle: handleToggle,
      source: buttonRef,
      query,
      handleSelectClear,
      handleSelectChange,
      possibleCollections,
      possibleCategories,
      npmPackageType
    }
  )), query.collections?.map((collection) => /* @__PURE__ */ react.createElement(
    FilterTag,
    {
      name: collection,
      key: collection,
      handleRemove: () => handleTagRemove(collection, "collections")
    }
  )), npmPackageType === "plugin" && query.categories?.map((category) => /* @__PURE__ */ react.createElement(
    FilterTag,
    {
      name: category,
      key: category,
      handleRemove: () => handleTagRemove(category, "categories")
    }
  )));
};
FilterTag.propTypes = {
  name: (prop_types_default()).string.isRequired,
  handleRemove: (prop_types_default()).func.isRequired
};
NpmPackagesFilters.propTypes = {
  npmPackageType: prop_types_default().oneOf(["plugin", "provider"]).isRequired,
  possibleCollections: (prop_types_default()).object.isRequired,
  possibleCategories: (prop_types_default()).object.isRequired,
  query: (prop_types_default()).object.isRequired,
  handleSelectChange: (prop_types_default()).func.isRequired,
  handleSelectClear: (prop_types_default()).func.isRequired
};
/* harmony default export */ const components_NpmPackagesFilters = (NpmPackagesFilters);

// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Loader/Loader.mjs + 1 modules
var Loader = __webpack_require__(74863);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Grid/Grid.mjs
var Grid = __webpack_require__(31988);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Grid/GridItem.mjs
var GridItem = __webpack_require__(6498);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Typography/Typography.mjs + 2 modules
var Typography = __webpack_require__(10574);
// EXTERNAL MODULE: ./node_modules/@strapi/icons/dist/EmptyDocuments.mjs
var EmptyDocuments = __webpack_require__(94355);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Layout/GridLayout.mjs
var GridLayout = __webpack_require__(91839);
;// CONCATENATED MODULE: ./.cache/admin/src/pages/MarketplacePage/components/EmptyNpmPackageSearch/EmptyNpmPackageGrid.js



const EmptyPluginCard = (0,styled_components_browser_esm["default"])((0,Box/* Box */.x))`
  background: ${({ theme }) => `linear-gradient(180deg, rgba(234, 234, 239, 0) 0%, ${theme.colors.neutral150} 100%)`};
  opacity: 0.33;
`;
const EmptyNpmPackageGrid = () => {
  return /* @__PURE__ */ react.createElement(GridLayout/* GridLayout */.M, null, Array(12).fill(null).map((_, idx) => /* @__PURE__ */ react.createElement(
    EmptyPluginCard,
    {
      key: `empty-plugin-card-${idx}`,
      height: "234px",
      hasRadius: true
    }
  )));
};

;// CONCATENATED MODULE: ./.cache/admin/src/pages/MarketplacePage/components/EmptyNpmPackageSearch/index.js





const EmptyNpmPackageSearch = ({ content }) => {
  return /* @__PURE__ */ react.createElement(Box/* Box */.x, { position: "relative" }, /* @__PURE__ */ react.createElement(EmptyNpmPackageGrid, null), /* @__PURE__ */ react.createElement(Box/* Box */.x, { position: "absolute", top: 11, width: "100%" }, /* @__PURE__ */ react.createElement(Flex/* Flex */.k, { alignItems: "center", justifyContent: "center", direction: "column" }, /* @__PURE__ */ react.createElement(Icon/* Icon */.J, { as: EmptyDocuments/* default */.Z, color: "", width: "160px", height: "88px" }), /* @__PURE__ */ react.createElement(Box/* Box */.x, { paddingTop: 6 }, /* @__PURE__ */ react.createElement(Typography/* Typography */.Z, { variant: "delta", as: "p", textColor: "neutral600" }, content)))));
};
EmptyNpmPackageSearch.propTypes = {
  content: (prop_types_default()).string.isRequired
};
/* harmony default export */ const components_EmptyNpmPackageSearch = (EmptyNpmPackageSearch);

// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Tooltip/Tooltip.mjs + 3 modules
var Tooltip = __webpack_require__(81315);
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/v2/LinkButton/LinkButton.mjs
var LinkButton = __webpack_require__(94101);
// EXTERNAL MODULE: ./node_modules/@strapi/icons/dist/CheckCircle.mjs
var CheckCircle = __webpack_require__(54211);
// EXTERNAL MODULE: ./node_modules/pluralize/pluralize.js
var pluralize = __webpack_require__(23450);
var pluralize_default = /*#__PURE__*/__webpack_require__.n(pluralize);
// EXTERNAL MODULE: ./.cache/admin/src/assets/images/logo-strapi-2022.svg
var logo_strapi_2022 = __webpack_require__(61473);
// EXTERNAL MODULE: ./node_modules/@strapi/icons/dist/Check.mjs
var Check = __webpack_require__(18226);
// EXTERNAL MODULE: ./node_modules/@strapi/icons/dist/Duplicate.mjs
var Duplicate = __webpack_require__(43838);
// EXTERNAL MODULE: ./node_modules/semver/index.js
var semver = __webpack_require__(81249);
var semver_default = /*#__PURE__*/__webpack_require__.n(semver);
;// CONCATENATED MODULE: ./.cache/admin/src/pages/MarketplacePage/components/NpmPackageCard/CardButton.js






const TooltipButton = ({ description, installMessage, disabled, handleCopy, pluginName }) => /* @__PURE__ */ react.createElement(Tooltip/* Tooltip */.u, { "data-testid": `tooltip-${pluginName}`, description }, /* @__PURE__ */ react.createElement(Box/* Box */.x, null, /* @__PURE__ */ react.createElement(
  Button/* Button */.z,
  {
    size: "S",
    startIcon: /* @__PURE__ */ react.createElement(Duplicate/* default */.Z, null),
    variant: "secondary",
    disabled,
    onClick: handleCopy
  },
  installMessage
)));
const CardButton = ({ strapiPeerDepVersion, strapiAppVersion, handleCopy, pluginName }) => {
  const { formatMessage } = (0,useIntl/* default */.Z)();
  const versionRange = semver_default().validRange(strapiPeerDepVersion);
  const isCompatible = semver_default().satisfies(strapiAppVersion, versionRange);
  const installMessage = formatMessage({
    id: "admin.pages.MarketPlacePage.plugin.copy",
    defaultMessage: "Copy install command"
  });
  if (strapiAppVersion) {
    if (!versionRange) {
      return /* @__PURE__ */ react.createElement(
        TooltipButton,
        {
          installMessage,
          pluginName,
          description: formatMessage(
            {
              id: "admin.pages.MarketPlacePage.plugin.version.null",
              defaultMessage: 'Unable to verify compatibility with your Strapi version: "{strapiAppVersion}"'
            },
            { strapiAppVersion }
          ),
          handleCopy
        }
      );
    }
    if (!isCompatible) {
      return /* @__PURE__ */ react.createElement(
        TooltipButton,
        {
          installMessage,
          pluginName,
          description: formatMessage(
            {
              id: "admin.pages.MarketPlacePage.plugin.version",
              defaultMessage: 'Update your Strapi version: "{strapiAppVersion}" to: "{versionRange}"'
            },
            {
              strapiAppVersion,
              versionRange
            }
          ),
          disabled: true
        }
      );
    }
  }
  return /* @__PURE__ */ react.createElement(Button/* Button */.z, { size: "S", startIcon: /* @__PURE__ */ react.createElement(Duplicate/* default */.Z, null), variant: "secondary", onClick: handleCopy }, installMessage);
};
TooltipButton.defaultProps = {
  disabled: false,
  handleCopy: null
};
TooltipButton.propTypes = {
  description: (prop_types_default()).string.isRequired,
  installMessage: (prop_types_default()).string.isRequired,
  disabled: (prop_types_default()).bool,
  handleCopy: (prop_types_default()).func,
  pluginName: (prop_types_default()).string.isRequired
};
CardButton.defaultProps = {
  strapiAppVersion: null,
  strapiPeerDepVersion: null
};
CardButton.propTypes = {
  strapiAppVersion: (prop_types_default()).string,
  strapiPeerDepVersion: (prop_types_default()).string,
  handleCopy: (prop_types_default()).func.isRequired,
  pluginName: (prop_types_default()).string.isRequired
};
/* harmony default export */ const NpmPackageCard_CardButton = (CardButton);

;// CONCATENATED MODULE: ./.cache/admin/src/pages/MarketplacePage/components/NpmPackageCard/InstallPluginButton.js







const InstallPluginButton = ({
  isInstalled,
  isInDevelopmentMode,
  commandToCopy,
  strapiAppVersion,
  strapiPeerDepVersion,
  pluginName
}) => {
  const toggleNotification = (0,dist/* useNotification */.lm)();
  const { formatMessage } = (0,useIntl/* default */.Z)();
  const { trackUsage } = (0,dist/* useTracking */.rS)();
  const { copy } = (0,dist/* useClipboard */.VP)();
  const handleCopy = async () => {
    const didCopy = await copy(commandToCopy);
    if (didCopy) {
      trackUsage("willInstallPlugin");
      toggleNotification({
        type: "success",
        message: { id: "admin.pages.MarketPlacePage.plugin.copy.success" }
      });
    }
  };
  if (isInstalled) {
    return /* @__PURE__ */ react.createElement(Box/* Box */.x, { paddingLeft: 4 }, /* @__PURE__ */ react.createElement(Icon/* Icon */.J, { as: Check/* default */.Z, marginRight: 2, width: 12, height: 12, color: "success600" }), /* @__PURE__ */ react.createElement(Typography/* Typography */.Z, { variant: "omega", textColor: "success600", fontWeight: "bold" }, formatMessage({
      id: "admin.pages.MarketPlacePage.plugin.installed",
      defaultMessage: "Installed"
    })));
  }
  if (isInDevelopmentMode) {
    return /* @__PURE__ */ react.createElement(
      NpmPackageCard_CardButton,
      {
        strapiAppVersion,
        strapiPeerDepVersion,
        handleCopy,
        pluginName
      }
    );
  }
  return null;
};
InstallPluginButton.defaultProps = {
  strapiAppVersion: null,
  strapiPeerDepVersion: null
};
InstallPluginButton.propTypes = {
  isInstalled: (prop_types_default()).bool.isRequired,
  isInDevelopmentMode: (prop_types_default()).bool.isRequired,
  commandToCopy: (prop_types_default()).string.isRequired,
  strapiAppVersion: (prop_types_default()).string,
  strapiPeerDepVersion: (prop_types_default()).string,
  pluginName: (prop_types_default()).string.isRequired
};
/* harmony default export */ const NpmPackageCard_InstallPluginButton = (InstallPluginButton);

// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Divider/Divider.mjs
var Divider = __webpack_require__(26910);
// EXTERNAL MODULE: ./node_modules/@strapi/icons/dist/Github.mjs
var Github = __webpack_require__(10778);
// EXTERNAL MODULE: ./node_modules/@strapi/icons/dist/Star.mjs
var Star = __webpack_require__(82500);
// EXTERNAL MODULE: ./node_modules/@strapi/icons/dist/Download.mjs
var Download = __webpack_require__(95998);
;// CONCATENATED MODULE: ./.cache/admin/src/pages/MarketplacePage/components/NpmPackageCard/PackageStats.js







const VerticalDivider = (0,styled_components_browser_esm["default"])((0,Divider/* Divider */.i))`
  width: ${(0,dist/* pxToRem */.Q1)(12)};
  transform: rotate(90deg);
`;
const PackageStats = ({ githubStars, npmDownloads, npmPackageType }) => {
  const { formatMessage } = (0,useIntl/* default */.Z)();
  return /* @__PURE__ */ react.createElement(Flex/* Flex */.k, { gap: 1 }, !!githubStars && /* @__PURE__ */ react.createElement(react.Fragment, null, /* @__PURE__ */ react.createElement(Icon/* Icon */.J, { as: Github/* default */.Z, height: (0,dist/* pxToRem */.Q1)(12), width: (0,dist/* pxToRem */.Q1)(12), "aria-hidden": true }), /* @__PURE__ */ react.createElement(Icon/* Icon */.J, { as: Star/* default */.Z, height: (0,dist/* pxToRem */.Q1)(12), width: (0,dist/* pxToRem */.Q1)(12), color: "warning500", "aria-hidden": true }), /* @__PURE__ */ react.createElement(
    "p",
    {
      "aria-label": formatMessage(
        {
          id: `admin.pages.MarketPlacePage.${npmPackageType}.githubStars`,
          defaultMessage: `This {package} was starred {starsCount} on GitHub`
        },
        {
          starsCount: githubStars,
          package: npmPackageType
        }
      )
    },
    /* @__PURE__ */ react.createElement(Typography/* Typography */.Z, { variant: "pi", textColor: "neutral800" }, githubStars)
  ), /* @__PURE__ */ react.createElement(VerticalDivider, { unsetMargin: false, background: "neutral200" })), /* @__PURE__ */ react.createElement(Icon/* Icon */.J, { as: Download/* default */.Z, height: (0,dist/* pxToRem */.Q1)(12), width: (0,dist/* pxToRem */.Q1)(12), "aria-hidden": true }), /* @__PURE__ */ react.createElement(
    "p",
    {
      "aria-label": formatMessage(
        {
          id: `admin.pages.MarketPlacePage.${npmPackageType}.downloads`,
          defaultMessage: `This {package} has {downloadsCount} weekly downloads`
        },
        {
          downloadsCount: npmDownloads,
          package: npmPackageType
        }
      )
    },
    /* @__PURE__ */ react.createElement(Typography/* Typography */.Z, { variant: "pi", textColor: "neutral800" }, npmDownloads)
  ));
};
PackageStats.defaultProps = {
  githubStars: 0,
  npmDownloads: 0
};
PackageStats.propTypes = {
  githubStars: (prop_types_default()).number,
  npmDownloads: (prop_types_default()).number,
  npmPackageType: (prop_types_default()).string.isRequired
};
/* harmony default export */ const NpmPackageCard_PackageStats = (PackageStats);

;// CONCATENATED MODULE: ./.cache/admin/src/pages/MarketplacePage/components/NpmPackageCard/index.js












const EllipsisText = (0,styled_components_browser_esm["default"])((0,Typography/* Typography */.Z))`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`;
const NpmPackageCard = ({
  npmPackage,
  isInstalled,
  useYarn,
  isInDevelopmentMode,
  npmPackageType,
  strapiAppVersion
}) => {
  const { attributes } = npmPackage;
  const { formatMessage } = (0,useIntl/* default */.Z)();
  const { trackUsage } = (0,dist/* useTracking */.rS)();
  const commandToCopy = useYarn ? `yarn add ${attributes.npmPackageName}` : `npm install ${attributes.npmPackageName}`;
  const madeByStrapiMessage = formatMessage({
    id: "admin.pages.MarketPlacePage.plugin.tooltip.madeByStrapi",
    defaultMessage: "Made by Strapi"
  });
  const npmPackageHref = `https://market.strapi.io/${pluralize_default().plural(npmPackageType)}/${attributes.slug}`;
  return /* @__PURE__ */ react.createElement(
    Flex/* Flex */.k,
    {
      direction: "column",
      justifyContent: "space-between",
      paddingTop: 4,
      paddingRight: 4,
      paddingBottom: 4,
      paddingLeft: 4,
      hasRadius: true,
      background: "neutral0",
      shadow: "tableShadow",
      height: "100%",
      alignItems: "normal",
      "data-testid": "npm-package-card"
    },
    /* @__PURE__ */ react.createElement(Box/* Box */.x, null, /* @__PURE__ */ react.createElement(Flex/* Flex */.k, { direction: "row", justifyContent: "space-between", alignItems: "flex-start" }, /* @__PURE__ */ react.createElement(
      Box/* Box */.x,
      {
        as: "img",
        src: attributes.logo.url,
        alt: `${attributes.name} logo`,
        hasRadius: true,
        width: 11,
        height: 11
      }
    ), /* @__PURE__ */ react.createElement(
      NpmPackageCard_PackageStats,
      {
        githubStars: attributes.githubStars,
        npmDownloads: attributes.npmDownloads,
        npmPackageType
      }
    )), /* @__PURE__ */ react.createElement(Box/* Box */.x, { paddingTop: 4 }, /* @__PURE__ */ react.createElement(Typography/* Typography */.Z, { as: "h3", variant: "delta" }, /* @__PURE__ */ react.createElement(Flex/* Flex */.k, { alignItems: "center" }, attributes.name, attributes.validated && !attributes.madeByStrapi && /* @__PURE__ */ react.createElement(
      Tooltip/* Tooltip */.u,
      {
        description: formatMessage({
          id: "admin.pages.MarketPlacePage.plugin.tooltip.verified",
          defaultMessage: "Plugin verified by Strapi"
        })
      },
      /* @__PURE__ */ react.createElement(Flex/* Flex */.k, null, /* @__PURE__ */ react.createElement(Icon/* Icon */.J, { as: CheckCircle/* default */.Z, marginLeft: 2, color: "success600" }))
    ), attributes.madeByStrapi && /* @__PURE__ */ react.createElement(Tooltip/* Tooltip */.u, { description: madeByStrapiMessage }, /* @__PURE__ */ react.createElement(Flex/* Flex */.k, null, /* @__PURE__ */ react.createElement(
      Box/* Box */.x,
      {
        as: "img",
        src: logo_strapi_2022,
        alt: madeByStrapiMessage,
        marginLeft: 1,
        width: 6,
        height: "auto"
      }
    )))))), /* @__PURE__ */ react.createElement(Box/* Box */.x, { paddingTop: 2 }, /* @__PURE__ */ react.createElement(EllipsisText, { as: "p", variant: "omega", textColor: "neutral600" }, attributes.description))),
    /* @__PURE__ */ react.createElement(Flex/* Flex */.k, { gap: 2, style: { alignSelf: "flex-end" }, paddingTop: 6 }, /* @__PURE__ */ react.createElement(
      LinkButton/* LinkButton */.Q,
      {
        size: "S",
        href: npmPackageHref,
        isExternal: true,
        endIcon: /* @__PURE__ */ react.createElement(ExternalLink/* default */.Z, null),
        "aria-label": formatMessage(
          {
            id: "admin.pages.MarketPlacePage.plugin.info.label",
            defaultMessage: "Learn more about {pluginName}"
          },
          { pluginName: attributes.name }
        ),
        variant: "tertiary",
        onClick: () => trackUsage("didPluginLearnMore")
      },
      formatMessage({
        id: "admin.pages.MarketPlacePage.plugin.info.text",
        defaultMessage: "More"
      })
    ), /* @__PURE__ */ react.createElement(
      NpmPackageCard_InstallPluginButton,
      {
        isInstalled,
        isInDevelopmentMode,
        commandToCopy,
        strapiAppVersion,
        strapiPeerDepVersion: attributes.strapiVersion,
        pluginName: attributes.name
      }
    ))
  );
};
NpmPackageCard.defaultProps = {
  isInDevelopmentMode: false,
  strapiAppVersion: null
};
NpmPackageCard.propTypes = {
  npmPackage: prop_types_default().shape({
    id: (prop_types_default()).string.isRequired,
    attributes: prop_types_default().shape({
      name: (prop_types_default()).string.isRequired,
      description: (prop_types_default()).string.isRequired,
      slug: (prop_types_default()).string.isRequired,
      npmPackageName: (prop_types_default()).string.isRequired,
      npmPackageUrl: (prop_types_default()).string.isRequired,
      repositoryUrl: (prop_types_default()).string.isRequired,
      logo: (prop_types_default()).object.isRequired,
      developerName: (prop_types_default()).string.isRequired,
      validated: (prop_types_default()).bool.isRequired,
      madeByStrapi: (prop_types_default()).bool.isRequired,
      strapiCompatibility: prop_types_default().oneOf(["v3", "v4"]),
      strapiVersion: (prop_types_default()).string,
      githubStars: (prop_types_default()).number,
      npmDownloads: (prop_types_default()).number
    }).isRequired
  }).isRequired,
  isInstalled: (prop_types_default()).bool.isRequired,
  useYarn: (prop_types_default()).bool.isRequired,
  isInDevelopmentMode: (prop_types_default()).bool,
  npmPackageType: (prop_types_default()).string.isRequired,
  strapiAppVersion: (prop_types_default()).string
};
/* harmony default export */ const components_NpmPackageCard = (NpmPackageCard);

;// CONCATENATED MODULE: ./.cache/admin/src/pages/MarketplacePage/components/NpmPackagesGrid/index.js







const NpmPackagesGrid = ({
  status,
  npmPackages,
  installedPackageNames,
  useYarn,
  isInDevelopmentMode,
  npmPackageType,
  strapiAppVersion,
  debouncedSearch
}) => {
  const { formatMessage } = (0,useIntl/* default */.Z)();
  if (status === "error") {
    return /* @__PURE__ */ react.createElement(Flex/* Flex */.k, { paddingTop: 8 }, /* @__PURE__ */ react.createElement(dist/* AnErrorOccurred */.Hn, null));
  }
  if (status === "loading") {
    return /* @__PURE__ */ react.createElement(Flex/* Flex */.k, { justifyContent: "center", paddingTop: 8 }, /* @__PURE__ */ react.createElement(Loader/* Loader */.a, null, "Loading content..."));
  }
  const emptySearchMessage = formatMessage(
    {
      id: "admin.pages.MarketPlacePage.search.empty",
      defaultMessage: 'No result for "{target}"'
    },
    { target: debouncedSearch }
  );
  if (npmPackages.length === 0) {
    return /* @__PURE__ */ react.createElement(components_EmptyNpmPackageSearch, { content: emptySearchMessage });
  }
  return /* @__PURE__ */ react.createElement(Grid/* Grid */.r, { gap: 4 }, npmPackages.map((npmPackage) => /* @__PURE__ */ react.createElement(GridItem/* GridItem */.P, { col: 4, s: 6, xs: 12, style: { height: "100%" }, key: npmPackage.id }, /* @__PURE__ */ react.createElement(
    components_NpmPackageCard,
    {
      npmPackage,
      isInstalled: installedPackageNames.includes(npmPackage.attributes.npmPackageName),
      useYarn,
      isInDevelopmentMode,
      npmPackageType,
      strapiAppVersion
    }
  ))));
};
NpmPackagesGrid.defaultProps = {
  npmPackages: [],
  installedPackageNames: [],
  strapiAppVersion: null,
  debouncedSearch: ""
};
NpmPackagesGrid.propTypes = {
  status: (prop_types_default()).string.isRequired,
  npmPackages: (prop_types_default()).array,
  installedPackageNames: prop_types_default().arrayOf((prop_types_default()).string),
  useYarn: (prop_types_default()).bool.isRequired,
  isInDevelopmentMode: (prop_types_default()).bool.isRequired,
  npmPackageType: (prop_types_default()).string.isRequired,
  strapiAppVersion: (prop_types_default()).string,
  debouncedSearch: (prop_types_default()).string
};
/* harmony default export */ const components_NpmPackagesGrid = (NpmPackagesGrid);

;// CONCATENATED MODULE: ./.cache/admin/src/pages/MarketplacePage/components/NpmPackagesPagination/index.js




const NpmPackagesPagination = ({ pagination }) => {
  return /* @__PURE__ */ react.createElement(Box/* Box */.x, { paddingTop: 4 }, /* @__PURE__ */ react.createElement(Flex/* Flex */.k, { alignItems: "flex-end", justifyContent: "space-between" }, /* @__PURE__ */ react.createElement(dist/* PageSizeURLQuery */.v4, { options: ["12", "24", "50", "100"], defaultValue: "24" }), /* @__PURE__ */ react.createElement(dist/* PaginationURLQuery */.tU, { pagination })));
};
NpmPackagesPagination.propTypes = {
  pagination: prop_types_default().shape({
    page: (prop_types_default()).number.isRequired,
    pageCount: (prop_types_default()).number.isRequired,
    pageSize: (prop_types_default()).number.isRequired,
    total: (prop_types_default()).number.isRequired
  }).isRequired
};
/* harmony default export */ const components_NpmPackagesPagination = (NpmPackagesPagination);

;// CONCATENATED MODULE: ./.cache/admin/src/assets/images/icon_offline-cloud.svg
const icon_offline_cloud_namespaceObject = __webpack_require__.p + "9d5d788027e86620c234.svg";
// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/Layout/HeaderLayout.mjs + 2 modules
var HeaderLayout = __webpack_require__(90731);
// EXTERNAL MODULE: ./node_modules/@strapi/icons/dist/Upload.mjs
var Upload = __webpack_require__(59071);
;// CONCATENATED MODULE: ./.cache/admin/src/pages/MarketplacePage/components/PageHeader/index.js







const PageHeader = ({ isOnline, npmPackageType }) => {
  const { formatMessage } = (0,useIntl/* default */.Z)();
  const { trackUsage } = (0,dist/* useTracking */.rS)();
  const tracking = npmPackageType === "provider" ? "didSubmitProvider" : "didSubmitPlugin";
  return /* @__PURE__ */ react.createElement(
    HeaderLayout/* HeaderLayout */.T,
    {
      title: formatMessage({
        id: "global.marketplace",
        defaultMessage: "Marketplace"
      }),
      subtitle: formatMessage({
        id: "admin.pages.MarketPlacePage.subtitle",
        defaultMessage: "Get more out of Strapi"
      }),
      primaryAction: isOnline && /* @__PURE__ */ react.createElement(
        LinkButton/* LinkButton */.Q,
        {
          startIcon: /* @__PURE__ */ react.createElement(Upload/* default */.Z, null),
          variant: "tertiary",
          href: `https://market.strapi.io/submit-${npmPackageType}`,
          onClick: () => trackUsage(tracking),
          isExternal: true
        },
        formatMessage({
          id: `admin.pages.MarketPlacePage.submit.${npmPackageType}.link`,
          defaultMessage: `Submit ${npmPackageType}`
        })
      )
    }
  );
};
/* harmony default export */ const components_PageHeader = (PageHeader);
PageHeader.defaultProps = {
  npmPackageType: "plugin"
};
PageHeader.propTypes = {
  isOnline: (prop_types_default()).bool.isRequired,
  npmPackageType: (prop_types_default()).string
};

;// CONCATENATED MODULE: ./.cache/admin/src/pages/MarketplacePage/components/OfflineLayout/index.js






const OfflineLayout = () => {
  const { formatMessage } = (0,useIntl/* default */.Z)();
  return /* @__PURE__ */ react.createElement(Layout/* Layout */.A, null, /* @__PURE__ */ react.createElement(Main/* Main */.o, null, /* @__PURE__ */ react.createElement(components_PageHeader, { isOnline: false }), /* @__PURE__ */ react.createElement(
    Flex/* Flex */.k,
    {
      width: "100%",
      direction: "column",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: (0,dist/* pxToRem */.Q1)(120)
    },
    /* @__PURE__ */ react.createElement(Box/* Box */.x, { paddingBottom: 2 }, /* @__PURE__ */ react.createElement(Typography/* Typography */.Z, { textColor: "neutral700", variant: "alpha" }, formatMessage({
      id: "admin.pages.MarketPlacePage.offline.title",
      defaultMessage: "You are offline"
    }))),
    /* @__PURE__ */ react.createElement(Box/* Box */.x, { paddingBottom: 6 }, /* @__PURE__ */ react.createElement(Typography/* Typography */.Z, { textColor: "neutral700", variant: "epsilon" }, formatMessage({
      id: "admin.pages.MarketPlacePage.offline.subtitle",
      defaultMessage: "You need to be connected to the Internet to access Strapi Market."
    }))),
    /* @__PURE__ */ react.createElement("img", { src: icon_offline_cloud_namespaceObject, alt: "offline", style: { width: "88px", height: "88px" } })
  )));
};
/* harmony default export */ const components_OfflineLayout = (OfflineLayout);

;// CONCATENATED MODULE: ./.cache/admin/src/pages/MarketplacePage/components/SortSelect/index.js





const SelectWrapper = (0,styled_components_browser_esm["default"])((0,Box/* Box */.x))`
  font-weight: ${({ theme }) => theme.fontWeights.semiBold};

  span {
    font-size: ${({ theme }) => theme.fontSizes[1]};
  }

  /* Hide the label, every input needs a label. */
  label {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }
`;
const SortSelect = ({ sortQuery, handleSelectChange }) => {
  const { formatMessage } = (0,useIntl/* default */.Z)();
  const sortTypes = {
    "name:asc": {
      selected: {
        id: "admin.pages.MarketPlacePage.sort.alphabetical.selected",
        defaultMessage: "Sort by alphabetical order"
      },
      option: {
        id: "admin.pages.MarketPlacePage.sort.alphabetical",
        defaultMessage: "Alphabetical order"
      }
    },
    "submissionDate:desc": {
      selected: {
        id: "admin.pages.MarketPlacePage.sort.newest.selected",
        defaultMessage: "Sort by newest"
      },
      option: {
        id: "admin.pages.MarketPlacePage.sort.newest",
        defaultMessage: "Newest"
      }
    },
    "githubStars:desc": {
      selected: {
        id: "admin.pages.MarketPlacePage.sort.githubStars.selected",
        defaultMessage: "Sort by GitHub stars"
      },
      option: {
        id: "admin.pages.MarketPlacePage.sort.githubStars",
        defaultMessage: "Number of GitHub stars"
      }
    },
    "npmDownloads:desc": {
      selected: {
        id: "admin.pages.MarketPlacePage.sort.npmDownloads.selected",
        defaultMessage: "Sort by npm downloads"
      },
      option: {
        id: "admin.pages.MarketPlacePage.sort.npmDownloads",
        defaultMessage: "Number of downloads"
      }
    }
  };
  return /* @__PURE__ */ react.createElement(SelectWrapper, null, /* @__PURE__ */ react.createElement(
    Select/* Select */.P,
    {
      size: "S",
      id: "sort-by-select",
      value: sortQuery,
      customizeContent: () => formatMessage(sortTypes[sortQuery].selected),
      onChange: (sortName) => {
        handleSelectChange({ sort: sortName });
      },
      label: formatMessage({
        id: "admin.pages.MarketPlacePage.sort.label",
        defaultMessage: "Sort by"
      })
    },
    Object.entries(sortTypes).map(([sortName, messages]) => {
      return /* @__PURE__ */ react.createElement(Option/* Option */.W, { key: sortName, value: sortName }, formatMessage(messages.option));
    })
  ));
};
SortSelect.propTypes = {
  sortQuery: (prop_types_default()).string.isRequired,
  handleSelectChange: (prop_types_default()).func.isRequired
};
/* harmony default export */ const components_SortSelect = (SortSelect);

;// CONCATENATED MODULE: ./.cache/admin/src/pages/MarketplacePage/hooks/useNavigatorOnline.ts

const useNavigatorOnline = () => {
  const onlineStatus = typeof navigator !== "undefined" && typeof navigator.onLine === "boolean" ? navigator.onLine : true;
  const [isOnline, setIsOnline] = react.useState(onlineStatus);
  const setOnline = () => setIsOnline(true);
  const setOffline = () => setIsOnline(false);
  react.useEffect(() => {
    window.addEventListener("online", setOnline);
    window.addEventListener("offline", setOffline);
    return () => {
      window.removeEventListener("online", setOnline);
      window.removeEventListener("offline", setOffline);
    };
  }, []);
  return isOnline;
};

// EXTERNAL MODULE: ./node_modules/@strapi/design-system/dist/LiveRegions/useNotifyAT.mjs
var useNotifyAT = __webpack_require__(334);
// EXTERNAL MODULE: ./node_modules/qs/lib/index.js
var lib = __webpack_require__(80129);
var lib_default = /*#__PURE__*/__webpack_require__.n(lib);
// EXTERNAL MODULE: ./node_modules/react-query/es/index.js
var react_query_es = __webpack_require__(88767);
;// CONCATENATED MODULE: ./.cache/admin/src/pages/MarketplacePage/constants.js
const MARKETPLACE_API_URL = "https://market-api.strapi.io";

;// CONCATENATED MODULE: ./.cache/admin/src/pages/MarketplacePage/hooks/useFetchMarketplacePlugins/index.js




const useFetchMarketplacePlugins = (notifyLoad, params = {}) => {
  const toggleNotification = (0,dist/* useNotification */.lm)();
  return (0,react_query_es.useQuery)(
    ["marketplace", "plugins", params],
    async () => {
      try {
        const queryString = lib_default().stringify(lib_default().parse(params));
        const res = await fetch(`${MARKETPLACE_API_URL}/plugins?${queryString}`);
        if (!res.ok) {
          throw new Error("Failed to fetch marketplace plugins.");
        }
        const data = await res.json();
        return data;
      } catch (error) {
      }
      return null;
    },
    {
      onSuccess() {
        if (notifyLoad) {
          notifyLoad();
        }
      },
      onError() {
        toggleNotification({
          type: "warning",
          message: { id: "notification.error", defaultMessage: "An error occured" }
        });
      }
    }
  );
};

;// CONCATENATED MODULE: ./.cache/admin/src/pages/MarketplacePage/hooks/useFetchMarketplaceProviders/index.js




const useFetchMarketplaceProviders = (notifyLoad, params = {}) => {
  const toggleNotification = (0,dist/* useNotification */.lm)();
  return (0,react_query_es.useQuery)(
    ["marketplace", "providers", params],
    async () => {
      try {
        const queryString = lib_default().stringify(lib_default().parse(params));
        const res = await fetch(`${MARKETPLACE_API_URL}/providers?${queryString}`);
        if (!res.ok) {
          throw new Error("Failed to fetch marketplace providers.");
        }
        const data = await res.json();
        return data;
      } catch (error) {
      }
      return null;
    },
    {
      onSuccess() {
        if (notifyLoad) {
          notifyLoad();
        }
      },
      onError() {
        toggleNotification({
          type: "warning",
          message: { id: "notification.error", defaultMessage: "An error occured" }
        });
      }
    }
  );
};

;// CONCATENATED MODULE: ./.cache/admin/src/pages/MarketplacePage/utils/useMarketplaceData.js





function useMarketplaceData({ npmPackageType, debouncedSearch, query, tabQuery }) {
  const { notifyStatus } = (0,useNotifyAT/* useNotifyAT */.G)();
  const { formatMessage } = (0,useIntl/* default */.Z)();
  const marketplaceTitle = formatMessage({
    id: "global.marketplace",
    defaultMessage: "Marketplace"
  });
  const notifyMarketplaceLoad = () => {
    notifyStatus(
      formatMessage(
        {
          id: "app.utils.notify.data-loaded",
          defaultMessage: "The {target} has loaded"
        },
        { target: marketplaceTitle }
      )
    );
  };
  const paginationParams = {
    page: query?.page || 1,
    pageSize: query?.pageSize || 24
  };
  const { data: pluginsResponse, status: pluginsStatus } = useFetchMarketplacePlugins(
    notifyMarketplaceLoad,
    {
      ...tabQuery.plugin,
      pagination: paginationParams,
      search: debouncedSearch
    }
  );
  const { data: providersResponse, status: providersStatus } = useFetchMarketplaceProviders(
    notifyMarketplaceLoad,
    {
      ...tabQuery.provider,
      pagination: paginationParams,
      search: debouncedSearch
    }
  );
  const npmPackageTypeResponse = npmPackageType === "plugin" ? pluginsResponse : providersResponse;
  const npmPackageTypeStatus = npmPackageType === "plugin" ? pluginsStatus : providersStatus;
  const [possibleCollections, setPossibleCollections] = (0,react.useState)({});
  const [possibleCategories, setPossibleCategories] = (0,react.useState)({});
  (0,react.useEffect)(() => {
    if (npmPackageTypeStatus === "success") {
      setPossibleCollections(npmPackageTypeResponse.meta.collections);
    }
    if (pluginsStatus === "success") {
      setPossibleCategories(pluginsResponse.meta.categories);
    }
  }, [
    pluginsResponse?.meta.categories,
    pluginsStatus,
    npmPackageTypeResponse?.meta.collections,
    npmPackageTypeStatus
  ]);
  const { pagination } = npmPackageTypeStatus === "success" ? npmPackageTypeResponse.meta : {};
  return {
    pluginsResponse,
    providersResponse,
    pluginsStatus,
    providersStatus,
    possibleCollections,
    possibleCategories,
    pagination
  };
}
/* harmony default export */ const utils_useMarketplaceData = (useMarketplaceData);

;// CONCATENATED MODULE: ./.cache/admin/src/pages/MarketplacePage/index.js

















const MarketPlacePage = () => {
  const { formatMessage } = (0,useIntl/* default */.Z)();
  const { trackUsage } = (0,dist/* useTracking */.rS)();
  const trackUsageRef = (0,react.useRef)(trackUsage);
  const toggleNotification = (0,dist/* useNotification */.lm)();
  const [{ query }, setQuery] = (0,dist/* useQueryParams */.Kx)();
  const debouncedSearch = (0,useDebounce/* useDebounce */.N)(query?.search, 500) || "";
  const { autoReload: isInDevelopmentMode, dependencies, useYarn, strapiVersion } = (0,dist/* useAppInfo */.L7)();
  const isOnline = useNavigatorOnline();
  const npmPackageType = query?.npmPackageType || "plugin";
  const [tabQuery, setTabQuery] = (0,react.useState)({
    plugin: npmPackageType === "plugin" ? { ...query } : {},
    provider: npmPackageType === "provider" ? { ...query } : {}
  });
  (0,dist/* useFocusWhenNavigate */.go)();
  (0,react.useEffect)(() => {
    trackUsageRef.current("didGoToMarketplace");
  }, []);
  (0,react.useEffect)(() => {
    if (!isInDevelopmentMode) {
      toggleNotification({
        type: "info",
        message: {
          id: "admin.pages.MarketPlacePage.production",
          defaultMessage: "Manage plugins from the development environment"
        }
      });
    }
  }, [toggleNotification, isInDevelopmentMode]);
  const {
    pluginsResponse,
    providersResponse,
    pluginsStatus,
    providersStatus,
    possibleCollections,
    possibleCategories,
    pagination
  } = utils_useMarketplaceData({ npmPackageType, debouncedSearch, query, tabQuery });
  if (!isOnline) {
    return /* @__PURE__ */ react.createElement(components_OfflineLayout, null);
  }
  const handleTabChange = (selected) => {
    const selectedTab = selected === 0 ? "plugin" : "provider";
    const hasTabQuery = tabQuery[selectedTab] && Object.keys(tabQuery[selectedTab]).length;
    if (hasTabQuery) {
      setQuery({
        // Keep filters and search
        ...tabQuery[selectedTab],
        search: query?.search || "",
        // Set tab and reset page
        npmPackageType: selectedTab,
        page: 1
      });
    } else {
      setQuery({
        // Set tab
        npmPackageType: selectedTab,
        // Clear filters
        collections: [],
        categories: [],
        sort: "name:asc",
        page: 1,
        // Keep search
        search: query?.search || ""
      });
    }
  };
  const handleSelectChange = (update) => {
    setQuery({ ...update, page: 1 });
    setTabQuery((prev) => ({
      ...prev,
      [npmPackageType]: { ...prev[npmPackageType], ...update }
    }));
  };
  const handleSelectClear = (filterType) => {
    setQuery({ [filterType]: [], page: null }, "remove");
    setTabQuery((prev) => ({ ...prev, [npmPackageType]: {} }));
  };
  const installedPackageNames = Object.keys(dependencies);
  return /* @__PURE__ */ react.createElement(Layout/* Layout */.A, null, /* @__PURE__ */ react.createElement(Main/* Main */.o, null, /* @__PURE__ */ react.createElement(
    Helmet/* Helmet */.q,
    {
      title: formatMessage({
        id: "admin.pages.MarketPlacePage.helmet",
        defaultMessage: "Marketplace - Plugins"
      })
    }
  ), /* @__PURE__ */ react.createElement(components_PageHeader, { isOnline, npmPackageType }), /* @__PURE__ */ react.createElement(ContentLayout/* ContentLayout */.D, null, /* @__PURE__ */ react.createElement(
    TabGroup/* TabGroup */.v,
    {
      label: formatMessage({
        id: "admin.pages.MarketPlacePage.tab-group.label",
        defaultMessage: "Plugins and Providers for Strapi"
      }),
      id: "tabs",
      variant: "simple",
      initialSelectedTabIndex: ["plugin", "provider"].indexOf(npmPackageType),
      onTabChange: handleTabChange
    },
    /* @__PURE__ */ react.createElement(Flex/* Flex */.k, { justifyContent: "space-between", paddingBottom: 4 }, /* @__PURE__ */ react.createElement(Tabs/* Tabs */.m, null, /* @__PURE__ */ react.createElement(Tabs/* Tab */.O, null, formatMessage({
      id: "admin.pages.MarketPlacePage.plugins",
      defaultMessage: "Plugins"
    }), " ", pluginsStatus === "success" ? `(${pluginsResponse.meta.pagination.total})` : "..."), /* @__PURE__ */ react.createElement(Tabs/* Tab */.O, null, formatMessage({
      id: "admin.pages.MarketPlacePage.providers",
      defaultMessage: "Providers"
    }), " ", providersStatus === "success" ? `(${providersResponse.meta.pagination.total})` : "...")), /* @__PURE__ */ react.createElement(Box/* Box */.x, { width: "25%" }, /* @__PURE__ */ react.createElement(
      Searchbar/* Searchbar */.w,
      {
        name: "searchbar",
        onClear: () => setQuery({ search: "", page: 1 }),
        value: query?.search,
        onChange: (e) => setQuery({ search: e.target.value, page: 1 }),
        clearLabel: formatMessage({
          id: "admin.pages.MarketPlacePage.search.clear",
          defaultMessage: "Clear the search"
        }),
        placeholder: formatMessage({
          id: "admin.pages.MarketPlacePage.search.placeholder",
          defaultMessage: "Search"
        })
      },
      formatMessage({
        id: "admin.pages.MarketPlacePage.search.placeholder",
        defaultMessage: "Search"
      })
    ))),
    /* @__PURE__ */ react.createElement(Flex/* Flex */.k, { paddingBottom: 4, gap: 2 }, /* @__PURE__ */ react.createElement(
      components_SortSelect,
      {
        sortQuery: query?.sort || "name:asc",
        handleSelectChange
      }
    ), /* @__PURE__ */ react.createElement(
      components_NpmPackagesFilters,
      {
        npmPackageType,
        possibleCollections,
        possibleCategories,
        query: query || {},
        handleSelectChange,
        handleSelectClear
      }
    )),
    /* @__PURE__ */ react.createElement(TabPanels/* TabPanels */.n, null, /* @__PURE__ */ react.createElement(TabPanels/* TabPanel */.x, null, /* @__PURE__ */ react.createElement(
      components_NpmPackagesGrid,
      {
        npmPackages: pluginsResponse?.data,
        status: pluginsStatus,
        installedPackageNames,
        useYarn,
        isInDevelopmentMode,
        npmPackageType: "plugin",
        strapiAppVersion: strapiVersion,
        debouncedSearch
      }
    )), /* @__PURE__ */ react.createElement(TabPanels/* TabPanel */.x, null, /* @__PURE__ */ react.createElement(
      components_NpmPackagesGrid,
      {
        npmPackages: providersResponse?.data,
        status: providersStatus,
        installedPackageNames,
        useYarn,
        isInDevelopmentMode,
        npmPackageType: "provider",
        debouncedSearch
      }
    )))
  ), pagination && /* @__PURE__ */ react.createElement(components_NpmPackagesPagination, { pagination }), /* @__PURE__ */ react.createElement(Box/* Box */.x, { paddingTop: 8 }, /* @__PURE__ */ react.createElement(components_MissingPluginBanner, null)))));
};
const ProtectedMarketPlace = () => {
  const permissions = (0,es/* useSelector */.v9)(selectors/* selectAdminPermissions */._);
  return /* @__PURE__ */ react.createElement(dist/* CheckPagePermissions */.O4, { permissions: permissions.marketplace.main }, /* @__PURE__ */ react.createElement(MarketPlacePage, null));
};

/* harmony default export */ const MarketplacePage = (ProtectedMarketPlace);


/***/ })

}]);