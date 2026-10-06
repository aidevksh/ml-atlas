import { describe, it, expect } from 'vitest';
import { binaryClassification, classification, smoothedTarget } from './classificationMath';

const sum=(xs:number[])=>xs.reduce((s,v)=>s+v,0);
describe('Softmax Jacobian and composed CE gradients',()=>{
 it('matches independent central differences for every Jacobian entry',()=>{
  for(const z of [[2,1,0],[-2,3,1],[0,0,0]])for(const tau of [.5,1,2]){
   const y=[1,0,0],r=classification(z,y,tau),h=1e-5;
   for(let j=0;j<3;j++){const left=z.map((v,k)=>v-(k===j?h:0)),right=z.map((v,k)=>v+(k===j?h:0));
    for(let i=0;i<3;i++)expect(r.jacobian[i][j]).toBeCloseTo((classification(right,y,tau).probabilities[i]-classification(left,y,tau).probabilities[i])/(2*h),8);
   }
  }
 });
 it('has positive diagonal, negative cross derivatives, symmetry and zero column sums',()=>{
  const r=classification([2,-1,3],[0,1,0],.7);
  for(let j=0;j<3;j++){expect(sum(r.jacobian.map(row=>row[j]))).toBeCloseTo(0,12);
   for(let i=0;i<3;i++){expect(r.jacobian[i][j]).toBeCloseTo(r.jacobian[j][i],12);if(i===j)expect(r.jacobian[i][j]).toBeGreaterThan(0);else expect(r.jacobian[i][j]).toBeLessThan(0);}
  }
 });
 it('CE gradients match finite differences for hard and soft targets at each temperature',()=>{
  const z=[2,1,-2],h=1e-5;
  for(const target of [0,1,2])for(const smoothing of [0,.2,1])for(const tau of [.5,1,2]){
   const y=smoothedTarget(3,target,smoothing),r=classification(z,y,tau);
   for(let j=0;j<3;j++){const left=z.map((v,k)=>v-(k===j?h:0)),right=z.map((v,k)=>v+(k===j?h:0));expect(r.gradient[j]).toBeCloseTo((classification(right,y,tau).loss-classification(left,y,tau).loss)/(2*h),8);}
   expect(sum(r.gradient)).toBeCloseTo(0,12);
  }
 });
 it('summing every probability path equals the fused logit gradient',()=>{
  const y=[.2,.3,.5],r=classification([2,1,0],y,.6);
  for(let j=0;j<3;j++)expect(sum(r.probabilities.map((p,i)=>-y[i]/p*r.jacobian[i][j]))).toBeCloseTo(r.gradient[j],12);
 });
 it('keeps a finite loss when a probability underflows and ignores zero target terms',()=>{
  const wrong=classification([1000,0,-1000],[0,0,1]);
  expect(wrong.probabilities[2]).toBe(0);expect(wrong.loss).toBe(2000);expect(wrong.gradient).toEqual([1,0,-1]);
  expect(classification([1000,0,-1000],[1,0,0]).loss).toBeCloseTo(0,12);
 });
 it('preserves probabilities, losses and gradients after common logit shifts',()=>{
  const a=classification([2,1,0],[.8,.1,.1]),b=classification([1002,1001,1000],[.8,.1,.1]);
  expect(a).toEqual(b);
 });
 it('a modest logit step lowers CE for both hard and soft targets',()=>{
  for(const y of [[1,0,0],[.8,.1,.1]])for(const tau of [.5,1,2]){const z=[2,1,0],r=classification(z,y,tau),next=z.map((v,j)=>v-.2*r.gradient[j]);expect(classification(next,y,tau).loss).toBeLessThan(r.loss);}
 });
 it('reaches H(y), rather than zero loss, at p=y for a soft target',()=>{
  const y=[.6,.3,.1],r=classification(y.map(Math.log),y);expect(r.loss).toBeCloseTo(-sum(y.map(v=>v*Math.log(v))),12);for(const g of r.gradient)expect(g).toBeCloseTo(0,12);
 });
 it('rejects unnormalized targets, invalid labels and nonpositive temperatures',()=>{
  expect(()=>classification([2,1],[1,1])).toThrow();expect(()=>classification([2,1],[1,0],0)).toThrow();expect(()=>classification([NaN,1],[1,0])).toThrow();expect(()=>smoothedTarget(3,3)).toThrow();expect(()=>smoothedTarget(3,1,-.1)).toThrow();
 });
});
describe('Sigmoid BCE derivatives',()=>{
 it('matches independent central differences for hard and soft binary labels',()=>{
  for(const y of [0,.2,1])for(const z of [-4,-1,0,2,4]){const h=1e-5;expect(binaryClassification(z,y).gradient).toBeCloseTo((binaryClassification(z+h,y).loss-binaryClassification(z-h,y).loss)/(2*h),8);}
 });
 it('retains gradients for saturated but confidently incorrect predictions',()=>{
  expect(binaryClassification(-1000,1)).toEqual({probability:0,loss:1000,gradient:-1});expect(binaryClassification(1000,0)).toEqual({probability:1,loss:1000,gradient:1});
 });
});
