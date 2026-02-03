import { useNavigate } from 'react-router-dom';
import BackButton from '@components/common/BackButton';
import BottomNavBar from '@components/layout/BottomNavBar';

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f8f7f6] dark:bg-[#211811] pb-20">
      {/* Top App Bar */}
      <div className="flex items-center bg-[#f8f7f6] dark:bg-[#211811] p-4 justify-between sticky top-0 z-10 border-b-2 border-gray-200 dark:border-gray-700 shadow-md">
        <BackButton className="w-12 h-12 shrink-0 max-h-[40px] max-w-[40px]" />
        <h2 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          About Us
        </h2>
        <div className="w-12"></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Hero Section */}
          <section className="text-center">
            <div className="bg-white dark:bg-[#2d221a] rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-lg mb-6">
              <h1 className="text-3xl font-extrabold text-[#181411] dark:text-white mb-3">
                HungerWood
              </h1>
              <p className="text-lg text-[#887263] dark:text-gray-400 font-semibold">
                Multi-cuisine • Premium Dining Experience
              </p>
            </div>
          </section>

          {/* Our Story */}
          <section>
            <h2 className="text-[#181411] dark:text-white text-xl font-bold mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7f4f13] dark:text-[#d4a574]">
                restaurant_menu
              </span>
              Our Story
            </h2>
            <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
              <p className="text-[#887263] dark:text-gray-400 text-sm leading-relaxed">
                Welcome to HungerWood, where culinary excellence meets convenience. We are a premium multi-cuisine restaurant dedicated to delivering exceptional dining experiences right to your doorstep. Founded with a passion for great food and outstanding service, HungerWood brings together the finest ingredients, authentic flavors, and innovative recipes to create memorable meals for our customers.
              </p>
            </div>
          </section>

          {/* Our Mission */}
          <section>
            <h2 className="text-[#181411] dark:text-white text-xl font-bold mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7f4f13] dark:text-[#d4a574]">
                flag
              </span>
              Our Mission
            </h2>
            <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
              <p className="text-[#887263] dark:text-gray-400 text-sm leading-relaxed mb-3">
                Our mission is to provide our customers with:
              </p>
              <ul className="list-disc list-inside text-[#887263] dark:text-gray-400 text-sm leading-relaxed ml-4 space-y-2">
                <li>Fresh, high-quality ingredients in every dish</li>
                <li>Authentic flavors from diverse cuisines</li>
                <li>Fast and reliable delivery service</li>
                <li>Exceptional customer experience at every touchpoint</li>
                <li>Affordable pricing without compromising on quality</li>
              </ul>
            </div>
          </section>

          {/* What Makes Us Special */}
          <section>
            <h2 className="text-[#181411] dark:text-white text-xl font-bold mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7f4f13] dark:text-[#d4a574]">
                star
              </span>
              What Makes Us Special
            </h2>
            <div className="space-y-3">
              <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-[#181411] dark:text-white text-base font-semibold mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#7f4f13] dark:text-[#d4a574] text-lg">
                    local_dining
                  </span>
                  Diverse Menu
                </h3>
                <p className="text-[#887263] dark:text-gray-400 text-sm leading-relaxed">
                  From traditional favorites to contemporary fusion, our extensive menu caters to all taste preferences. Whether you crave Indian, Chinese, Continental, or regional specialties, we have something delicious for everyone.
                </p>
              </div>

              <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-[#181411] dark:text-white text-base font-semibold mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#7f4f13] dark:text-[#d4a574] text-lg">
                    verified
                  </span>
                  Quality Assurance
                </h3>
                <p className="text-[#887263] dark:text-gray-400 text-sm leading-relaxed">
                  We maintain the highest standards of food safety and hygiene. Every dish is prepared with care, using fresh ingredients and following strict quality control measures.
                </p>
              </div>

              <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-[#181411] dark:text-white text-base font-semibold mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#7f4f13] dark:text-[#d4a574] text-lg">
                    delivery_dining
                  </span>
                  Fast Delivery
                </h3>
                <p className="text-[#887263] dark:text-gray-400 text-sm leading-relaxed">
                  We understand that great food should reach you hot and fresh. Our efficient delivery system ensures your order arrives on time, every time.
                </p>
              </div>

              <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-[#181411] dark:text-white text-base font-semibold mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#7f4f13] dark:text-[#d4a574] text-lg">
                    support_agent
                  </span>
                  Customer First
                </h3>
                <p className="text-[#887263] dark:text-gray-400 text-sm leading-relaxed">
                  Your satisfaction is our priority. We listen to your feedback, accommodate special requests, and continuously improve our services to exceed your expectations.
                </p>
              </div>
            </div>
          </section>

          {/* Our Values */}
          <section>
            <h2 className="text-[#181411] dark:text-white text-xl font-bold mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7f4f13] dark:text-[#d4a574]">
                favorite
              </span>
              Our Values
            </h2>
            <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#7f4f13] dark:text-[#d4a574] text-xl">
                    check_circle
                  </span>
                  <div>
                    <h3 className="text-[#181411] dark:text-white text-sm font-semibold mb-1">Integrity</h3>
                    <p className="text-[#887263] dark:text-gray-400 text-xs leading-relaxed">
                      We operate with honesty and transparency in everything we do.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#7f4f13] dark:text-[#d4a574] text-xl">
                    check_circle
                  </span>
                  <div>
                    <h3 className="text-[#181411] dark:text-white text-sm font-semibold mb-1">Excellence</h3>
                    <p className="text-[#887263] dark:text-gray-400 text-xs leading-relaxed">
                      We strive for perfection in every dish and every interaction.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#7f4f13] dark:text-[#d4a574] text-xl">
                    check_circle
                  </span>
                  <div>
                    <h3 className="text-[#181411] dark:text-white text-sm font-semibold mb-1">Innovation</h3>
                    <p className="text-[#887263] dark:text-gray-400 text-xs leading-relaxed">
                      We continuously evolve our menu and services to stay ahead.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#7f4f13] dark:text-[#d4a574] text-xl">
                    check_circle
                  </span>
                  <div>
                    <h3 className="text-[#181411] dark:text-white text-sm font-semibold mb-1">Community</h3>
                    <p className="text-[#887263] dark:text-gray-400 text-xs leading-relaxed">
                      We are committed to serving and supporting our local community.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-[#181411] dark:text-white text-xl font-bold mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7f4f13] dark:text-[#d4a574]">
                contact_support
              </span>
              Get in Touch
            </h2>
            <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
              <p className="text-[#887263] dark:text-gray-400 text-sm leading-relaxed mb-4">
                We'd love to hear from you! Whether you have feedback, questions, or just want to say hello, feel free to reach out.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#7f4f13] dark:text-[#d4a574] text-xl">
                    location_on
                  </span>
                  <div>
                    <p className="text-[#181411] dark:text-white text-sm font-semibold">Address</p>
                    <p className="text-[#887263] dark:text-gray-400 text-sm">
                      Gaya, Bihar, India
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#7f4f13] dark:text-[#d4a574] text-xl">
                    email
                  </span>
                  <div>
                    <p className="text-[#181411] dark:text-white text-sm font-semibold">Email</p>
                    <p className="text-[#887263] dark:text-gray-400 text-sm">
                      support@hungerwood.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#7f4f13] dark:text-[#d4a574] text-xl">
                    phone
                  </span>
                  <div>
                    <p className="text-[#181411] dark:text-white text-sm font-semibold">Phone</p>
                    <p className="text-[#887263] dark:text-gray-400 text-sm">
                      +91-XXXX-XXXXXX
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="pt-4">
            <div className="bg-gradient-to-r from-[#7f4f13] to-[#9d6b2a] rounded-xl p-6 text-center shadow-lg">
              <h3 className="text-white text-lg font-bold mb-2">Ready to Order?</h3>
              <p className="text-white/90 text-sm mb-4">
                Explore our delicious menu and place your order today!
              </p>
              <button
                onClick={() => navigate('/menu')}
                className="bg-white text-[#7f4f13] font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors"
              >
                View Menu
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNavBar />
    </div>
  );
};

export default AboutUs;
