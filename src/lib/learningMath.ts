import { sigmoid } from './lessonModelTypes';
import { gelu } from './math';
export const activationNames=['ReLU','Leaky ReLU','tanh','Sigmoid','GELU','SiLU'] as const;
export const activationEquations=[
 ['ReLU(x)=max(0,x)','x<0: φ′=0; x>0: φ′=1; x=0: 미분 없음','음수 구간은 상수 0이라 미분 0, 양수 구간은 x라 미분 1입니다. 0의 좌·우 미분이 다릅니다. PyTorch ReLU backward는 0에서 0을 선택합니다.'],
 ['LeakyReLU(x)=x (x≥0), αx (x<0), α=0.1','x<0: φ′=α; x>0: φ′=1; x=0: 미분 없음','각 선형 구간의 계수를 미분값으로 가져옵니다. α≠1일 때 0에서 좌·우 미분이 다르므로 고전적 미분은 없습니다.'],
 ['tanh(x)=(eˣ−e⁻ˣ)/(eˣ+e⁻ˣ)','φ′=[(eˣ+e⁻ˣ)²−(eˣ−e⁻ˣ)²]/(eˣ+e⁻ˣ)²\n=1−tanh²(x)','분자와 분모를 각각 미분해 몫의 법칙을 적용합니다. |x|가 크면 tanh²가 1에 가까워져 미분이 작아집니다.'],
 ['σ(x)=(1+e⁻ˣ)⁻¹','σ′=−(1+e⁻ˣ)⁻²(−e⁻ˣ)\n=e⁻ˣ/(1+e⁻ˣ)²=σ(1−σ)','역수의 미분과 지수의 연쇄법칙을 적용합니다. 두 음수가 상쇄되어 항상 양수이며 최대는 x=0의 1/4입니다.'],
 ['정확 GELU=xΦ(x); φN(x)=e⁻ˣ²ᐟ²/√(2π)\n이 실험: u=√(2/π)(x+0.044715x³); G≈x(1+tanh u)/2','정확 G′=Φ(x)+xφN(x)\n근사 G′=(1+tanh u)/2+x(1−tanh²u)u′/2\nu′=√(2/π)(1+3×0.044715x²)','곱의 법칙과 tanh의 연쇄법칙을 적용합니다. 그래프·수치값은 tanh 근사 함수를 해석적으로 미분한 값이며 정확 GELU의 미분과 구분합니다.'],
 ['SiLU(x)=xσ(x)','φ′=1×σ+xσ′\n=σ+xσ(1−σ)','곱의 법칙을 적용하고 sigmoid의 미분을 대입합니다. 음수 영역에서 함수가 조금 내려가는 구간은 미분도 음수일 수 있습니다.'],
] as const;
export function activationValue(mode:number,x:number) { return [()=>Math.max(0,x),()=>x>=0?x:.1*x,()=>Math.tanh(x),()=>sigmoid(x),()=>gelu(x),()=>x*sigmoid(x)][mode](); }
export function activationDerivative(mode:number,x:number):number|null {
 if(mode<2)return x===0?null:x>0?1:mode===0?0:.1;
 if(mode===2)return 1-Math.tanh(x)**2;
 const s=sigmoid(x);if(mode===3)return s*(1-s);if(mode===5)return s+x*s*(1-s);
 const u=Math.sqrt(2/Math.PI)*(x+.044715*x**3),t=Math.tanh(u),du=Math.sqrt(2/Math.PI)*(1+3*.044715*x*x);
 return .5*(1+t)+.5*x*(1-t*t)*du;
}
export type NetworkParameters={w1:number[];b1:number[];w2:number[];b2:number};
export const trainingInputs=[-1,0,1],trainingTargets=[1,0,1];
export const initialNetwork=():NetworkParameters=>({w1:[.7,-.4],b1:[.2,.3],w2:[.8,-.6],b2:.1});
export function networkForward(p:NetworkParameters,x:number) {const z=p.w1.map((w,i)=>w*x+p.b1[i]),h=z.map(Math.tanh),prediction=h.reduce((s,v,i)=>s+v*p.w2[i],p.b2);return{z,h,prediction};}
export function networkBatch(p:NetworkParameters) {
 const gradient:NetworkParameters={w1:[0,0],b1:[0,0],w2:[0,0],b2:0};let loss=0;
 const samples=trainingInputs.map((x,i)=>{const r=networkForward(p,x),target=trainingTargets[i],error=r.prediction-target,dz=r.h.map((h,j)=>error*p.w2[j]*(1-h*h));loss+=error*error/(2*trainingInputs.length);gradient.b2+=error/trainingInputs.length;r.h.forEach((h,j)=>{gradient.w2[j]+=error*h/trainingInputs.length;gradient.w1[j]+=dz[j]*x/trainingInputs.length;gradient.b1[j]+=dz[j]/trainingInputs.length;});return{x,target,error,dz,...r};});
 return{loss,gradient,samples};
}
export function networkStep(p:NetworkParameters,rate:number) {const {gradient:g}=networkBatch(p);return{w1:p.w1.map((v,i)=>v-rate*g.w1[i]),b1:p.b1.map((v,i)=>v-rate*g.b1[i]),w2:p.w2.map((v,i)=>v-rate*g.w2[i]),b2:p.b2-rate*g.b2};}
