import {useState} from "react";
import {Link} from "react-router-dom";


function Page() {
    let [page, setPage] = useState(1);
    let [amount, setAmount] = useState(10);

    let [pageStart, setPageStart] = useState(0);
    let [pageEnd, setPageEnd] = useState(0);

    let [pageBody, setPageBody] = useState([]);

    const createPage =  (item, func) => {
        let next = item.next;
        let prev = item.prev;
        let pageList = item.pageList;
        setPageStart(item.start);
        setPageEnd(item.end);


        const pages = [];

        // 이전 버튼 추가
        if (prev) {
            pages.push(
                <p className="prev" key="prev" >
                    <strong>{'<'}</strong>
                </p>
            );
        }

        // 페이지 번호 추가
        console.log(pageList);
        for (let i = 0; i < pageList.length; i++) {
            pages.push(
                <p className="number" key={i}>
                    <strong>{pageList[i]}</strong>
                </p>
            )
        }

        // 다음 버튼 추가
        if (next) {
            pages.push(
                <p className="next" key="next">
                    <strong>{'>'}</strong>
                </p>
            );
        }

        // 페이지 요소를 상태로 설정
        setPageBody(pages);
    }

// 페이지네이션 이벤트 -> 뒤늦게 그려지기 때문에 부모에 걸고 자식에 위임)
    const pageClick = (e) => {
        let tagName = e.target.tagName;
        if (tagName !== 'P') {
            return;
        }

        let className = e.target.className;
        if (className === 'prev') {
            setPage(pageStart -1);
        }

        if (className === 'next') {
            setPage(pageStart + 1);
        }

        if (className === 'number') {
            console.log(e.target.firstChild.innerHTML);
            setPage(e.target.firstChild.innerHTML);
        }
    };

    return {
        page,
        setPage,
        amount,
        setAmount,
        pageStart,
        setPageStart,
        pageEnd,
        setPageEnd,
        pageBody,
        createPage,
        pageClick,
    }
}

export default Page;