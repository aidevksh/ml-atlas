import { curriculum,getTopic,conceptLinks,type ConceptLink } from '../data/curriculum';
import { readings } from '../data/lessons';
const extraAliases:Record<string,string[]>={ 'neural-network':['신경망','순전파','역전파'],'linear-embedding':['Embedding','임베딩'],'information-theory':['엔트로피'],'cross-entropy':['크로스 엔트로피','크로스엔트로피','교차 엔트로피','교차엔트로피','Cross-Entropy','CrossEntropy','cross-entropy','cross entropy'],'torch-autograd':['Autograd'],'torch-loop':['학습 루프'],activation:['활성화 함수','Sigmoid','ReLU','GELU','SiLU','tanh'],softmax:['Softmax','softmax'],gradients:['경사하강법','편미분'],normalization:['BatchNorm','LayerNorm','RMSNorm'],optimizers:['AdamW','SGD'],vectors:['내적','벡터'],matrices:['행렬곱'],derivatives:['연쇄법칙'],'cs-dp':['동적계획법'],'cs-graph':['BFS','DFS'],'cs-heap-topk':['Top-k'],'cs-strings':['KMP','Trie']};
const aliases=curriculum.flatMap(t=>[t.title,...(extraAliases[t.id]??[])].map(alias=>({alias,id:t.id}))).sort((a,b)=>b.alias.length-a.alias.length);
const escape=(s:string)=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const pattern=new RegExp(aliases.map(a=>escape(a.alias)).join('|'),'g');
export interface ConceptSegment {text:string;id?:string;}
export function conceptSegments(text:string,current?:string):ConceptSegment[] {
 const parts:ConceptSegment[]=[],seen=new Set<string>();let end=0;
 for(const match of text.matchAll(pattern)){const offset=match.index!,alias=aliases.find(a=>a.alias===match[0])!;parts.push({text:text.slice(end,offset)});const before=text[offset-1]??'',after=text[offset+match[0].length]??'',wordCollision=/[A-Za-z0-9]/.test(match[0][0])&&(/[A-Za-z0-9]/.test(before)||/[A-Za-z0-9]/.test(after));const link=alias.id!==current&&!seen.has(alias.id)&&!wordCollision;parts.push({text:match[0],id:link?alias.id:undefined});if(link)seen.add(alias.id);end=offset+match[0].length;}
 parts.push({text:text.slice(end)});return parts;
}
// Exactly the same parser and prose fields as the displayed inline links; backlinks stay truthful.
const proseLinks:ConceptLink[]=curriculum.flatMap(t=>{
 const r=readings[t.id],texts=[r.why,r.definition,...r.mechanism,r.reading,...r.symbols.map(([,meaning])=>meaning),t.expansion!.explanation,t.example,...r.derivation,r.pitfall,r.question,r.answer];
 const linkedIds=[...new Set(texts.flatMap(text=>conceptSegments(text,t.id).flatMap(part=>part.id?[part.id]:[])))];
 return linkedIds.map(to=>({from:t.id,to,kind:'본문 링크' as const,explanation:`${t.title} 본문에서 ${getTopic(to)!.title}의 계산·의미를 함께 설명합니다.`}));
});
export const allConceptLinks=[...conceptLinks,...proseLinks];
