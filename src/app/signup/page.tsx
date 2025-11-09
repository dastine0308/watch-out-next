import { SignupForm } from "@/components/auth/signup-form";

const features = [
  {
    title: "End-to-End Encryption",
    description: "All data encrypted with your private key",
  },
  {
    title: "Zero-Knowledge Verification",
    description: "Prove identity without revealing secrets",
  },
  {
    title: "Family Certificate Support",
    description: "Multi-level security with shared certificates",
  },
];

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-7xl">
        {/* Desktop Layout */}
        <div className="hidden items-center justify-between gap-16 px-8 lg:flex">
          {/* Left Side - Branding & Features */}
          <div className="max-w-[600px] flex-1 space-y-8">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900">WatchOut</h1>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-[1.2] text-gray-900">
                All Fall Detection. Instant Alerts. Total Peace of Mind.
              </h2>
              <p className="max-w-[516px] text-lg leading-relaxed text-gray-600">
                Protect the ones you care about.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex h-4 w-4 flex-shrink-0 items-start justify-center pt-0.5">
                    <span className="text-base text-green-600">✓</span>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-bold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="w-full max-w-[400px] flex-shrink-0">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
              <div className="mb-6 border-b border-gray-200 pb-6">
                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                  Sign Up
                </h3>
              </div>
              <SignupForm />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="mx-auto w-full max-w-md space-y-6 lg:hidden">
          {/* Logo & Branding */}
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">WatchOut</h1>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900">
                All Fall Detection. Instant Alerts. Total Peace of Mind.
              </h2>
              <p className="text-sm text-gray-600">
                Protect the ones you care about.
              </p>
            </div>
          </div>

          {/* Signup Form Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xl">
            <div className="mb-5 border-b border-gray-200 pb-4">
              <h3 className="mb-1 text-xl font-bold text-gray-900">Sign Up</h3>
            </div>
            <SignupForm />
          </div>

          {/* Features List */}
          <div className="space-y-4 pt-4">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex h-4 w-4 flex-shrink-0 items-start justify-center pt-0.5">
                  <span className="text-base text-green-600">✓</span>
                </div>
                <div>
                  <h3 className="mb-0.5 text-xs font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
