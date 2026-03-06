import React from 'react';
import { Check, Star, Zap, Music } from 'lucide-react';
import { Button } from './ui/Button';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  billing: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  icon: React.ReactNode;
}

const PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Khởi Đầu',
    price: 'Miễn phí',
    billing: 'Mãi mãi',
    description: 'Bắt đầu hành trình khám phá âm nhạc truyền thống Việt Nam.',
    icon: <Music className="w-6 h-6 text-[#8B4513]" />,
    features: [
      'Học 3 nhạc cụ cơ bản',
      'Truy cập 10 bản nhạc mẫu',
      'Chuyển đổi YouTube thành sheet (1 lần/ngày)',
      'Hỗ trợ cộng đồng'
    ]
  },
  {
    id: 'pro',
    name: 'Nghệ Nhân',
    price: '99.000đ',
    billing: '/tháng',
    description: 'Trải nghiệm không giới hạn mọi tính năng của VietMusic Studio.',
    isPopular: true,
    icon: <Star className="w-6 h-6 text-[#FAF7F0]" />,
    features: [
      'Mở khóa toàn bộ nhạc cụ truyền thống',
      'Kho bản nhạc cao cấp không giới hạn',
      'Chuyển đổi YouTube không giới hạn',
      'Phân tích kỹ năng chơi đàn bằng AI',
      'Chất lượng âm thanh Lossless HD',
      'Hỗ trợ ưu tiên 24/7'
    ]
  },
  {
    id: 'studio',
    name: 'Phòng Thu',
    price: '899.000đ',
    billing: '/năm',
    description: 'Dành cho giáo viên và người làm nhạc chuyên nghiệp.',
    icon: <Zap className="w-6 h-6 text-[#8B4513]" />,
    features: [
      'Mọi tính năng của gói Nghệ Nhân',
      'Tiết kiệm 25% so với gói tháng',
      'Bản quyền thương mại các bản nhạc',
      'Hỗ trợ xuất file MIDI & MusicXML',
      'Tạo lớp học ảo cho học viên',
      'Huy hiệu "Nghệ nhân" trên hồ sơ'
    ]
  }
];

export function PricingPlans() {
  return (
    <section id="pricing" className="py-24 px-6 bg-[#FAF7F0] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4A574]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#8B4513]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-[#3E2723] mb-4">
            Gói Cước Đăng Ký
          </h2>
          <p className="text-[#8B4513] text-xl font-serif italic max-w-2xl mx-auto">
            Chọn một gói phù hợp để bắt đầu hoặc nâng cấp trải nghiệm âm nhạc của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl transition-all duration-500 p-8 ${
                plan.id === 'pro'
                  ? 'bg-gradient-to-b from-[#8B4513] to-[#5D4037] text-[#FAF7F0] shadow-2xl scale-100 md:scale-105 z-10'
                  : plan.id === 'studio'
                  ? 'bg-[#3E2723] border border-[#D4A574]/20 text-[#FAF7F0] shadow-xl hover:shadow-2xl hover:-translate-y-1'
                  : 'bg-white border border-[#D4A574]/30 shadow-lg text-[#3E2723] hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D4A574] text-[#3E2723] px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider shadow-md font-serif whitespace-nowrap">
                  Phổ Thông Nhất
                </div>
              )}

              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-2xl font-bold font-serif ${
                  plan.id === 'pro' ? 'text-[#FAF7F0]' : plan.id === 'studio' ? 'text-[#D4A574]' : 'text-[#8B4513]'
                }`}>
                  {plan.name}
                </h3>
                <div className={`p-3 rounded-xl ${
                  plan.id === 'pro' ? 'bg-white/10' : plan.id === 'studio' ? 'bg-white/5 text-[#D4A574]' : 'bg-[#FAF7F0]'
                }`}>
                  {plan.id === 'studio' ? <Zap className="w-6 h-6 currentColor" /> : plan.icon}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-serif italic mb-4 opacity-90 h-10">
                  {plan.description}
                </p>
                <div className="flex items-end gap-1">
                  <span className={`text-4xl font-bold ${
                    plan.id === 'starter' ? 'text-[#3E2723]' : 'text-white'
                  }`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm mb-1 ${
                    plan.id === 'pro' ? 'text-[#FAF7F0]/70' : plan.id === 'studio' ? 'text-[#FAF7F0]/60' : 'text-[#654321]'
                  }`}>
                    {plan.billing}
                  </span>
                </div>
              </div>

              <Button
                className={`w-full py-6 text-lg mb-8 transition-all ${
                  plan.id === 'pro'
                    ? '!bg-[#FAF7F0] !text-[#8B4513] hover:!bg-white border-transparent'
                    : plan.id === 'studio'
                    ? '!bg-[#D4A574] !text-[#3E2723] hover:!bg-[#FAF7F0] border-transparent'
                    : 'bg-[#FAF7F0] text-[#8B4513] border-[#8B4513]/20 hover:border-[#8B4513] shadow-sm hover:bg-[#8B4513] hover:text-[#FAF7F0]'
                }`}
                variant={plan.isPopular ? 'primary' : 'outline'}
              >
                {plan.price === 'Miễn phí' ? 'Bắt Đầu Ngay' : 'Chọn Gói Này'}
              </Button>

              <div className="space-y-4">
                <p className={`text-sm font-bold uppercase tracking-wider ${
                  plan.id === 'pro' ? 'text-[#D4A574]' : plan.id === 'studio' ? 'text-[#D4A574]/80' : 'text-[#654321]'
                }`}>
                  Bao gồm:
                </p>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check
                        className={`w-5 h-5 shrink-0 ${
                          plan.id === 'starter' ? 'text-[#8B4513]' : 'text-[#D4A574]'
                        }`}
                      />
                      <span className={`text-sm ${
                        plan.id === 'pro' ? 'text-[#FAF7F0]/90' : plan.id === 'studio' ? 'text-[#FAF7F0]/80' : 'text-[#3E2723]/90'
                      } font-serif`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
