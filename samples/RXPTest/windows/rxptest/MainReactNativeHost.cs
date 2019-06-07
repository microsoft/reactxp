using ReactNative;
using ReactNative.Modules.Core;
using ReactNative.Shell;
using ReactNativeCommunity.NetInfo;
using System.Collections.Generic;

namespace rxptest
{
    class MainReactNativeHost : ReactNativeHost
    {
        public override string MainComponentName => "RXApp";

#if !BUNDLE || DEBUG
        public override bool UseDeveloperSupport => true;
#else
        public override bool UseDeveloperSupport => false;
#endif

        protected override string JavaScriptMainModuleName => "index.windows";

#if BUNDLE
        protected override string JavaScriptBundleFile => "ms-appx:///ReactAssets/index.windows.bundle";
#endif

        protected override List<IReactPackage> Packages => new List<IReactPackage>
        {
            new MainReactPackage(),
            new RNCNetInfoPackage(),
        };
    }
}
