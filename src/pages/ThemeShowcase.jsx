/**
 * Theme Showcase Page
 * 
 * This page demonstrates all HungerWood theme elements.
 * Access at: /theme-showcase (for development only)
 * 
 * To add route, update AppRoutes.jsx:
 * <Route path="/theme-showcase" element={<ThemeShowcase />} />
 */

import Button from '@components/common/Button';
import Input from '@components/common/Input';

const ThemeShowcase = () => {
    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container-custom">
                <div className="max-w-6xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="hw-title">HungerWood Theme Showcase</h1>
                        <p className="hw-subtitle">
                            Complete visual guide to the HungerWood design system
                        </p>
                    </div>

                    {/* Colors */}
                    <section className="hw-card mb-8">
                        <h2 className="hw-heading mb-6">Color Palette</h2>

                        {/* Primary Colors */}
                        <div className="mb-8">
                            <h3 className="hw-subheading mb-4">Primary (Wood Brown)</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                                <div>
                                    <div className="h-20 bg-primary-50 rounded-lg mb-2"></div>
                                    <p className="hw-caption">primary-50</p>
                                </div>
                                <div>
                                    <div className="h-20 bg-primary-200 rounded-lg mb-2"></div>
                                    <p className="hw-caption">primary-200</p>
                                </div>
                                <div>
                                    <div className="h-20 bg-primary rounded-lg mb-2"></div>
                                    <p className="hw-caption">primary</p>
                                </div>
                                <div>
                                    <div className="h-20 bg-primary-dark rounded-lg mb-2"></div>
                                    <p className="hw-caption">primary-dark</p>
                                </div>
                                <div>
                                    <div className="h-20 bg-primary-900 rounded-lg mb-2"></div>
                                    <p className="hw-caption">primary-900</p>
                                </div>
                            </div>
                        </div>

                        {/* Status Colors */}
                        <div className="mb-8">
                            <h3 className="hw-subheading mb-4">Status Colors</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div>
                                    <div className="h-20 bg-success rounded-lg mb-2"></div>
                                    <p className="hw-caption">Success (Veg)</p>
                                </div>
                                <div>
                                    <div className="h-20 bg-danger rounded-lg mb-2"></div>
                                    <p className="hw-caption">Danger (Non-veg)</p>
                                </div>
                                <div>
                                    <div className="h-20 bg-warning rounded-lg mb-2"></div>
                                    <p className="hw-caption">Warning</p>
                                </div>
                            </div>
                        </div>

                        {/* Text Colors */}
                        <div>
                            <h3 className="hw-subheading mb-4">Text Colors</h3>
                            <div className="space-y-2">
                                <p className="text-text-primary text-xl">text-text-primary</p>
                                <p className="text-text-secondary text-xl">text-text-secondary</p>
                                <p className="text-text-tertiary text-xl">text-text-tertiary</p>
                            </div>
                        </div>
                    </section>

                    {/* Typography */}
                    <section className="hw-card mb-8">
                        <h2 className="hw-heading mb-6">Typography</h2>

                        <div className="space-y-4">
                            <div>
                                <p className="hw-caption mb-2">hw-title</p>
                                <h1 className="hw-title">The quick brown fox jumps</h1>
                            </div>
                            <div>
                                <p className="hw-caption mb-2">hw-subtitle</p>
                                <p className="hw-subtitle">The quick brown fox jumps over the lazy dog</p>
                            </div>
                            <div>
                                <p className="hw-caption mb-2">hw-heading</p>
                                <h2 className="hw-heading">The quick brown fox jumps</h2>
                            </div>
                            <div>
                                <p className="hw-caption mb-2">hw-subheading</p>
                                <h3 className="hw-subheading">The quick brown fox jumps</h3>
                            </div>
                            <div>
                                <p className="hw-caption mb-2">hw-body</p>
                                <p className="hw-body">The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </div>
                            <div>
                                <p className="hw-caption mb-2">hw-caption</p>
                                <p className="hw-caption">The quick brown fox jumps over the lazy dog</p>
                            </div>
                        </div>
                    </section>

                    {/* Buttons */}
                    <section className="hw-card mb-8">
                        <h2 className="hw-heading mb-6">Buttons</h2>

                        {/* Variants */}
                        <div className="mb-6">
                            <h3 className="hw-subheading mb-4">Variants</h3>
                            <div className="flex flex-wrap gap-4">
                                <Button variant="primary">Primary</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="cta">CTA</Button>
                                <Button variant="outline">Outline</Button>
                                <Button variant="ghost">Ghost</Button>
                                <Button variant="success">Success</Button>
                                <Button variant="danger">Danger</Button>
                            </div>
                        </div>

                        {/* Sizes */}
                        <div className="mb-6">
                            <h3 className="hw-subheading mb-4">Sizes</h3>
                            <div className="flex flex-wrap items-center gap-4">
                                <Button variant="primary" size="sm">Small</Button>
                                <Button variant="primary" size="md">Medium</Button>
                                <Button variant="primary" size="lg">Large</Button>
                            </div>
                        </div>

                        {/* States */}
                        <div>
                            <h3 className="hw-subheading mb-4">States</h3>
                            <div className="flex flex-wrap gap-4">
                                <Button variant="primary">Normal</Button>
                                <Button variant="primary" loading>Loading</Button>
                                <Button variant="primary" disabled>Disabled</Button>
                            </div>
                        </div>
                    </section>

                    {/* Inputs */}
                    <section className="hw-card mb-8">
                        <h2 className="hw-heading mb-6">Form Inputs</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Text Input"
                                type="text"
                                placeholder="Enter text"
                            />
                            <Input
                                label="Email Input"
                                type="email"
                                placeholder="you@example.com"
                                required
                            />
                            <Input
                                label="Password Input"
                                type="password"
                                placeholder="••••••••"
                            />
                            <Input
                                label="Input with Error"
                                type="text"
                                error="This field is required"
                            />
                        </div>
                    </section>

                    {/* Badges */}
                    <section className="hw-card mb-8">
                        <h2 className="hw-heading mb-6">Badges</h2>

                        <div className="flex flex-wrap gap-4">
                            <span className="hw-badge-veg">🌱 Veg</span>
                            <span className="hw-badge-non-veg">🍗 Non-Veg</span>
                            <span className="hw-badge-primary">✨ Popular</span>
                            <span className="hw-badge hw-badge-primary">New</span>
                            <span className="hw-badge bg-warning/10 text-warning border border-warning/20">
                                Limited
                            </span>
                        </div>
                    </section>

                    {/* Cards */}
                    <section className="hw-card mb-8">
                        <h2 className="hw-heading mb-6">Cards</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Standard Card */}
                            <div className="hw-card">
                                <h3 className="hw-subheading mb-2">Standard Card</h3>
                                <p className="hw-body">
                                    Default card with shadow and hover effect.
                                </p>
                            </div>

                            {/* Flat Card */}
                            <div className="hw-card-flat">
                                <h3 className="hw-subheading mb-2">Flat Card</h3>
                                <p className="hw-body">
                                    Card with border instead of shadow.
                                </p>
                            </div>

                            {/* Food Card */}
                            <div className="hw-food-card">
                                <div className="h-32 bg-gradient-to-br from-success/20 to-success/30 flex items-center justify-center text-5xl">
                                    🍕
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold mb-1">Pizza</h3>
                                    <span className="hw-badge-veg mb-2">Veg</span>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="hw-price">₹299</span>
                                        <Button size="sm">Add</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Shadows */}
                    <section className="hw-card mb-8">
                        <h2 className="hw-heading mb-6">Shadows</h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="p-6 bg-surface shadow-sm rounded-lg text-center">
                                <p className="hw-caption">shadow-sm</p>
                            </div>
                            <div className="p-6 bg-surface shadow-md rounded-lg text-center">
                                <p className="hw-caption">shadow-md</p>
                            </div>
                            <div className="p-6 bg-surface shadow-lg rounded-lg text-center">
                                <p className="hw-caption">shadow-lg</p>
                            </div>
                            <div className="p-6 bg-surface shadow-xl rounded-lg text-center">
                                <p className="hw-caption">shadow-xl</p>
                            </div>
                        </div>
                    </section>

                    {/* Border Radius */}
                    <section className="hw-card mb-8">
                        <h2 className="hw-heading mb-6">Border Radius</h2>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="h-20 bg-primary/20 rounded-lg flex items-center justify-center">
                                <p className="hw-caption">rounded-lg</p>
                            </div>
                            <div className="h-20 bg-primary/20 rounded-xl flex items-center justify-center">
                                <p className="hw-caption">rounded-xl</p>
                            </div>
                            <div className="h-20 bg-primary/20 rounded-2xl flex items-center justify-center">
                                <p className="hw-caption">rounded-2xl</p>
                            </div>
                            <div className="h-20 bg-primary/20 rounded-3xl flex items-center justify-center">
                                <p className="hw-caption">rounded-3xl</p>
                            </div>
                            <div className="h-20 w-20 bg-primary/20 rounded-full flex items-center justify-center">
                                <p className="hw-caption text-xs">full</p>
                            </div>
                        </div>
                    </section>

                    {/* Animations */}
                    <section className="hw-card mb-8">
                        <h2 className="hw-heading mb-6">Animations</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 bg-primary/10 rounded-lg text-center animate-fadeIn">
                                <p className="font-medium">animate-fadeIn</p>
                            </div>
                            <div className="p-6 bg-primary/10 rounded-lg text-center animate-slideUp">
                                <p className="font-medium">animate-slideUp</p>
                            </div>
                            <div className="p-6 bg-primary/10 rounded-lg text-center animate-scaleIn">
                                <p className="font-medium">animate-scaleIn</p>
                            </div>
                        </div>
                    </section>

                    {/* Spacing */}
                    <section className="hw-card mb-8">
                        <h2 className="hw-heading mb-6">Spacing Scale</h2>

                        <div className="space-y-4">
                            {[4, 6, 8, 12, 16, 20, 24].map(size => (
                                <div key={size} className="flex items-center gap-4">
                                    <div className={`bg-primary h-12 rounded`} style={{ width: `${size * 4}px` }}></div>
                                    <p className="hw-body">p-{size} ({size * 4}px)</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Footer Note */}
                    <div className="text-center mt-16">
                        <p className="hw-body text-text-secondary">
                            For complete documentation, see <code className="bg-primary/10 px-2 py-1 rounded">THEME_GUIDE.md</code>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ThemeShowcase;
