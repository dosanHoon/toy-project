React 1000개 넘는 리스트 렌더링 할때
Viewport에만 보이는 리스트 아이템만 렌더링하기

1. intersection observer 사용함.

다만 리스트 아이템을 렌더링하지 않은 상태에서는 intersection observer을 감지 할수 없기 때문에 감싸는 더미 DIV를 추가함. 더미 DOM이 1000개가 생성되어 있기 때문에 효과가 감소할것이라는 예상

2. Scroll 크기 계산 하는 방법
