import React, { useState } from 'react';
import { ArrowLeft, CreditCard, QrCode, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface PaymentPageProps {
    onNavigate: (page: string) => void;
}

export function PaymentPage({ onNavigate }: PaymentPageProps) {
    const [paymentMethod, setPaymentMethod] = useState<'qr' | 'card'>('qr');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen w-full bg-[#FAF7F0] flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-wood-grain opacity-5 z-0" />
                <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 text-center border border-green-500/30">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold font-serif text-[#3E2723] mb-4">
                        Thanh toán thành công!
                    </h2>
                    <p className="text-[#654321] mb-8 font-serif">
                        Cảm ơn bạn đã đăng ký gói cước. Hãy bắt đầu hành trình âm nhạc ngay bây giờ.
                    </p>
                    <Button
                        className="w-full py-4 text-lg"
                        onClick={() => onNavigate('landing')}
                    >
                        Trở về Trang Chủ
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#FAF7F0] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background styling */}
            <div className="absolute inset-0 bg-wood-grain opacity-5 z-0" />
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D4A574]/20 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#8B4513]/10 rounded-full blur-3xl" />

            {/* Back button */}
            <button
                onClick={() => onNavigate('landing')}
                className="absolute top-8 left-8 z-20 flex items-center text-[#8B4513] hover:text-[#654321] transition-colors"
            >
                <ArrowLeft className="mr-2" size={20} />
                <span className="font-serif">Trở về</span>
            </button>

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-5 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">

                {/* Order Summary (Left Side) */}
                <div className="md:col-span-2 bg-[#3E2723] text-[#FAF7F0] p-8 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm uppercase tracking-widest text-[#D4A574] font-bold mb-6">Đơn Hàng Của Bạn</h3>

                        <div className="mb-6 pb-6 border-b border-white/10">
                            <h2 className="text-3xl font-bold font-serif mb-2">Gói Đăng Ký</h2>
                            <p className="text-[#D4A574]">VietMusic Premium</p>
                        </div>

                        <div className="space-y-4 font-serif">
                            <div className="flex justify-between">
                                <span className="opacity-80">Tạm tính:</span>
                                <span className="font-bold">99.000đ</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="opacity-80">Thuế (VAT):</span>
                                <span className="font-bold">0đ</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 mt-auto">
                        <div className="flex justify-between items-end">
                            <span className="text-lg opacity-90">Tổng cộng:</span>
                            <span className="text-4xl font-bold text-[#D4A574]">99K</span>
                        </div>
                    </div>
                </div>

                {/* Payment Options (Right Side) */}
                <div className="md:col-span-3 p-8 md:p-10">
                    <h2 className="text-2xl font-bold font-serif text-[#3E2723] mb-6 border-b border-[#D4A574]/30 pb-4">
                        Phương Thức Thanh Toán
                    </h2>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button
                            onClick={() => setPaymentMethod('qr')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'qr'
                                    ? 'border-[#8B4513] bg-[#8B4513]/5 text-[#8B4513]'
                                    : 'border-[#D4A574]/30 hover:border-[#8B4513]/50 text-[#654321]'
                                }`}
                        >
                            <QrCode size={32} className="mb-2" />
                            <span className="font-serif font-bold">Chuyển Khoản QR</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod('card')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'card'
                                    ? 'border-[#8B4513] bg-[#8B4513]/5 text-[#8B4513]'
                                    : 'border-[#D4A574]/30 hover:border-[#8B4513]/50 text-[#654321]'
                                }`}
                        >
                            <CreditCard size={32} className="mb-2" />
                            <span className="font-serif font-bold">Thẻ Tín Dụng</span>
                        </button>
                    </div>

                    <div className="bg-[#FAF7F0] p-6 rounded-2xl border border-[#D4A574]/20 mb-8 min-h-[250px] flex items-center justify-center">
                        {paymentMethod === 'qr' ? (
                            <div className="text-center">
                                <div className="w-48 h-48 bg-white p-2 rounded-xl border-2 border-[#8B4513]/20 mx-auto mb-4 relative overflow-hidden">
                                    {/* Fake QR code using basic shapes */}
                                    <div className="absolute inset-2 grid grid-cols-4 grid-rows-4 gap-1 opacity-80">
                                        {[...Array(16)].map((_, i) => (
                                            <div key={i} className={`bg-[#3E2723] ${Math.random() > 0.4 ? 'rounded-sm' : 'opacity-0'}`} />
                                        ))}
                                    </div>
                                    {/* QR Corners */}
                                    <div className="absolute top-2 left-2 w-8 h-8 border-4 border-[#3E2723] rounded-sm" />
                                    <div className="absolute top-2 right-2 w-8 h-8 border-4 border-[#3E2723] rounded-sm" />
                                    <div className="absolute bottom-2 left-2 w-8 h-8 border-4 border-[#3E2723] rounded-sm" />
                                </div>
                                <p className="text-sm font-serif text-[#654321]">Mở ứng dụng ngân hàng và quét mã QR</p>
                            </div>
                        ) : (
                            <div className="w-full space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#3E2723] mb-1 font-serif">Số thẻ</label>
                                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 border border-[#D4A574]/50 rounded-lg focus:ring-2 focus:ring-[#8B4513]/50 focus:border-[#8B4513]/50" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#3E2723] mb-1 font-serif">Ngày hết hạn</label>
                                        <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 border border-[#D4A574]/50 rounded-lg focus:ring-2 focus:ring-[#8B4513]/50 focus:border-[#8B4513]/50" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#3E2723] mb-1 font-serif">CVV</label>
                                        <input type="text" placeholder="123" className="w-full px-4 py-3 border border-[#D4A574]/50 rounded-lg focus:ring-2 focus:ring-[#8B4513]/50 focus:border-[#8B4513]/50" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full py-5 text-xl font-bold tracking-wide shadow-xl flex items-center justify-center relative overflow-hidden group"
                    >
                        {isProcessing ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang xử lý...
                            </span>
                        ) : (
                            <>
                                <ShieldCheck className="mr-2 w-6 h-6" />
                                Thanh Toán Ngay
                            </>
                        )}
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                    </Button>

                    <p className="text-center text-xs text-[#8B4513]/60 mt-4 font-serif flex items-center justify-center">
                        <ShieldCheck size={14} className="mr-1" /> Thanh toán được bảo mật và mã hóa an toàn.
                    </p>
                </div>
            </div>
        </div>
    );
}
