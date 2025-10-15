import { EvervaultCard, Icon } from "@/components/ui/evervault-card";

export default function EvervaultShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            Evervault Card Showcase
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Hover over the cards to reveal the amazing encrypted text effect
          </p>
        </div>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Card 1 - Default */}
          <div className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-start p-6 relative h-[28rem] bg-white dark:bg-slate-800 rounded-xl">
            <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

            <EvervaultCard text="hover" />

            <h2 className="dark:text-white text-black mt-4 text-lg font-semibold">
              Interactive Card
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Hover over this card to reveal an awesome effect with encrypted text.
            </p>
            <span className="text-sm border font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-3 py-1">
              Watch me hover
            </span>
          </div>

          {/* Card 2 - Pricing */}
          <div className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-start p-6 relative h-[28rem] bg-white dark:bg-slate-800 rounded-xl">
            <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

            <EvervaultCard text="$99" />

            <h2 className="dark:text-white text-black mt-4 text-lg font-semibold">
              Premium Plan
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Perfect for pricing cards and product showcases with dynamic effects.
            </p>
            <span className="text-sm border font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-3 py-1">
              Best Value
            </span>
          </div>

          {/* Card 3 - Feature */}
          <div className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-start p-6 relative h-[28rem] bg-white dark:bg-slate-800 rounded-xl">
            <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

            <EvervaultCard text="AI" />

            <h2 className="dark:text-white text-black mt-4 text-lg font-semibold">
              AI-Powered
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Showcase cutting-edge features with this modern card design.
            </p>
            <span className="text-sm border font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-3 py-1">
              New Feature
            </span>
          </div>
        </div>

        {/* Simple Examples */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            Simple Variations
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Minimal card designs without corner icons
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <EvervaultCard text="✓" className="h-48" />
            <p className="text-center mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              Success
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <EvervaultCard text="Pro" className="h-48" />
            <p className="text-center mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              Premium
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <EvervaultCard text="NEW" className="h-48" />
            <p className="text-center mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              Latest
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <EvervaultCard text="99" className="h-48" />
            <p className="text-center mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              Score
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            How to Use
          </h3>
          <div className="space-y-4 text-slate-600 dark:text-slate-400">
            <p>
              <strong className="text-slate-800 dark:text-slate-200">Import:</strong>{" "}
              <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-sm">
                import {"{ EvervaultCard }"} from "@/components/ui/evervault-card"
              </code>
            </p>
            <p>
              <strong className="text-slate-800 dark:text-slate-200">Usage:</strong>{" "}
              <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-sm">
                {"<EvervaultCard text=\"hover\" />"}
              </code>
            </p>
            <p>
              <strong className="text-slate-800 dark:text-slate-200">Props:</strong>{" "}
              <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-sm mr-2">
                text (string)
              </code>
              <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-sm">
                className (string)
              </code>
            </p>
            <p className="pt-2">
              Check the full documentation at{" "}
              <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-sm">
                /frontend/devtracker-frontend/EVERVAULT_CARD_DOCS.md
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
