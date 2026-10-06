const guides:Record<string,{code:string;explanation:string[]}>={
 'torch-tensors':{code:`import torch

x = torch.tensor([[1., 2., 3.], [4., 5., 6.]])
print(x.shape, x.dtype, x.device)
# torch.Size([2, 3]) torch.float32 cpu
ids = torch.tensor([1, 2], dtype=torch.long)
x64 = x.to(dtype=torch.float64)
device = "cuda" if torch.cuda.is_available() else "cpu"
x_on_device = x.to(device)`,explanation:['torch.tensor로 실제 데이터를 Tensor로 만듭니다. 정수 토큰 ID는 long, 미분할 feature는 보통 실수 dtype을 사용합니다.','to는 원하는 dtype·device의 Tensor를 반환합니다. 반환값을 받아야 이후 연산에서 그 Tensor를 사용합니다. 모델 파라미터와 입력의 device도 맞춰야 합니다.']},
 'torch-operations':{code:`import torch

A = torch.tensor([[1., 2.], [3., 4.]])
B = torch.tensor([[2., 0.], [1., 2.]])
print(A @ B)  # [[4, 4], [10, 8]]
print(A * B)  # [[2, 0], [3, 8]]
x = torch.arange(24).reshape(2, 3, 4)
permuted = x.permute(0, 2, 1)  # [2,4,3]
flat = permuted.reshape(2, 12)
feature_mean = A.mean(dim=0)   # [2,3]`,explanation:['@는 행렬곱, *는 원소별 곱입니다. shape가 같아도 실제 계산은 다릅니다.','permute는 축 순서를 바꿉니다. 결과가 contiguous가 아닐 수 있어 view의 메모리 조건을 확인해야 합니다. reshape는 필요하면 복사합니다. dim=0 평균은 행을 줄여 열별 평균을 남깁니다.']},
 'torch-module':{code:`import torch
from torch import nn

class Classifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(4, 8), nn.ReLU(), nn.Linear(8, 2)
        )

    def forward(self, x):
        return self.net(x)

model = Classifier()
logits = model(torch.ones(2, 4))  # [2,2]
print(sum(p.numel() for p in model.parameters()))  # 58`,explanation:['super().__init__가 Module의 등록 기능을 초기화합니다. self.net에 할당한 레이어의 파라미터는 model.parameters에서 조회됩니다.','model(x)는 forward와 Module의 hook 등 호출 처리를 함께 수행합니다. __init__는 구조를 만들고 forward는 입력마다 계산을 실행합니다.']},
 'torch-functional':{code:`import torch
from torch import nn
from torch.nn import functional as F

class Block(nn.Module):
    def __init__(self):
        super().__init__()
        self.projection = nn.Linear(2, 2)

    def forward(self, x):
        y = F.linear(x, self.projection.weight,
                     self.projection.bias)
        return F.dropout(F.relu(y), p=0.5,
                         training=self.training)

model = Block()
model.eval()`,explanation:['F.linear는 전달받은 weight·bias를 사용합니다. nn.Linear가 그 파라미터를 등록하고 보유합니다.','F.dropout의 기본 training 설정을 eval이 자동으로 바꿔주는 것으로 가정하면 안 됩니다. training=self.training으로 Module 모드를 전달합니다.']},
 'torch-autograd':{code:`import torch

x = torch.tensor(2., requires_grad=True)
for _ in range(2):
    y = x ** 2        # 매번 새 그래프
    y.backward()
print(x.grad)         # tensor(8.)
x.grad = None         # 누적값 초기화
(x ** 2).backward()
print(x.grad)         # tensor(4.)
print((x ** 2).detach().requires_grad)  # False`,explanation:['backward는 leaf의 .grad에 값을 더합니다. 매번 새 forward로 계산하므로 동일 그래프를 두 번 backward하는 오류와 구분해야 합니다.','일반적으로 backward 이후 해당 그래프의 중간 저장값은 해제됩니다. 동일 그래프의 재사용에는 retain_graph가 필요할 수 있습니다. detach는 이 결과의 미분 연결을 끊습니다.']},
 'torch-data':{code:`import torch
from torch.utils.data import TensorDataset, DataLoader

X = torch.arange(40, dtype=torch.float32).reshape(10, 4)
y = torch.arange(10) % 2
dataset = TensorDataset(X, y)
loader = DataLoader(dataset, batch_size=4,
                    shuffle=False, drop_last=False)
for xb, yb in loader:
    print(xb.shape, yb.shape)
# [4,4] [4], [4,4] [4], [2,4] [2]`,explanation:['Dataset은 한 표본의 입력과 정답을 제공하고 DataLoader는 여러 표본을 묶습니다. 표본마다 Batch 축을 미리 넣으면 축이 하나 더 생길 수 있습니다.','이 예제의 마지막 Batch는 2입니다. drop_last=True이면 제외됩니다. shuffle=True는 표본 순서를 바꾸며 검증·시간 자료의 처리 조건도 따로 판단해야 합니다.']},
 'torch-losses':{code:`import torch
from torch import nn

logits = torch.tensor([[2., 1., 0.]])
target = torch.tensor([0], dtype=torch.long)
loss = nn.CrossEntropyLoss()(logits, target)
print(loss.item())  # 약 0.4076

binary_logit = torch.tensor([2.])
binary_target = torch.tensor([1.])
bce = nn.BCEWithLogitsLoss()(binary_logit, binary_target)
print(bce.item())   # 약 0.1269`,explanation:['정수 class index를 사용하는 CE에서 target [B]는 long입니다. logits [B,C]는 확률로 변환하지 않고 전달합니다.','BCEWithLogitsLoss의 target은 입력과 같은 shape의 실수 0·1입니다. 같은 값 2라도 전체 클래스와 경쟁하는 logit인지 독립 이진 logit인지가 다릅니다.']},
 'torch-loop':{code:`import torch
from torch import nn

model = nn.Linear(4, 2)
optimizer = torch.optim.SGD(model.parameters(), lr=0.1)
criterion = nn.CrossEntropyLoss()
xb = torch.ones(2, 4)
yb = torch.tensor([0, 1], dtype=torch.long)

model.train()
optimizer.zero_grad(set_to_none=True)
logits = model(xb)
loss = criterion(logits, yb)
loss.backward()
torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
optimizer.step()`,explanation:['zero_grad는 누적값을 초기화합니다. forward와 loss는 현재 파라미터의 예측·오차를 계산합니다. backward는 Gradient를 구하고 step은 그 Gradient로 파라미터를 바꿉니다.','clipping을 사용할 때는 backward 이후 step 이전에 적용합니다. 실전에서는 이 과정을 DataLoader의 배치마다 반복하고 scheduler의 종류에 맞는 호출 시점을 확인합니다.']},
 'torch-modes':{code:`import torch
from torch import nn

model = nn.Sequential(nn.Linear(4, 2), nn.Dropout(0.5))
x = torch.ones(1, 4)
model.eval()
with torch.inference_mode():
    prediction = model(x)
print(prediction.requires_grad)  # False

model.train()          # 학습 동작 복구
output = model(x)      # Gradient 기록 가능
print(output.requires_grad)     # True`,explanation:['eval은 Dropout·BatchNorm 같은 Module의 동작을 바꿉니다. inference_mode는 자동미분 기록 등 추론에 불필요한 처리를 줄입니다.','두 설정은 서로 대체하지 않습니다. 파라미터 freeze는 requires_grad 설정으로 따로 처리하며, 평가 후 학습을 재개하면 train을 다시 설정합니다.']},
 'torch-checkpoints':{code:`# model과 optimizer를 만든 뒤 저장
torch.save({
    "model": model.state_dict(),
    "optimizer": optimizer.state_dict(),
    "step": step,
}, "checkpoint.pt")

# 같은 구조의 model·optimizer에 복원
checkpoint = torch.load("checkpoint.pt", map_location="cpu",
                        weights_only=True)
model.load_state_dict(checkpoint["model"])
optimizer.load_state_dict(checkpoint["optimizer"])
step = checkpoint["step"]`,explanation:['이 코드는 앞에서 생성한 model,optimizer,step을 사용한 저장·복원 부분입니다. Adam의 이동평균 같은 optimizer 상태도 같이 복원합니다.','재현이 중요하면 scheduler,난수 상태,자료 순서와 설정도 관리해야 합니다. seed 하나만으로 모든 장치·버전에서 동일한 결과를 보장하지 않습니다. 신뢰한 파일을 사용하고 device 조건을 확인하세요.']},
};
export default function PyTorchGuide({topicId}:{topicId:string}){const guide=guides[topicId];if(!guide)return null;return <section className="reading-section pytorch-guide"><span className="reading-label">개념을 코드와 연결하기</span><h2>파이토치에서는 이렇게 씁니다</h2><p>아래는 파이토치 환경에서 실행할 코드입니다. 이 웹페이지의 실험은 같은 원리를 TypeScript로 계산하며 Python을 실행하지 않습니다.</p><pre><code>{guide.code}</code></pre>{guide.explanation.map(text=><p key={text}>{text}</p>)}</section>;}
