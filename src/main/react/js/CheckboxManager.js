import { useState } from 'react';


function useCheckboxManager() {
    const [allCheck, setAllCheck] = useState(false);
    const [checkItem, setCheckItem] = useState({});
    const [showDelete, setShowDelete] = useState(false);

    const handleMasterCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setAllCheck(isChecked);

        const newCheckItem = {};
        const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const id = checkbox.parentElement.parentElement.children[1].textContent;
            newCheckItem[id] = isChecked;
        });
        setCheckItem(newCheckItem);

        // 체크박스가 여러 개 있고 선택되었을 때만 삭제 버튼을 표시
        if (checkboxes.length > 1) {
            setShowDelete(isChecked);
        } else {
            setShowDelete(false);
        }
    };

    const handleCheckboxChange = (e) => {
        const id = e.target.parentElement.parentElement.children[1].textContent;
        const isChecked = e.target.checked;

        setCheckItem(prev => ({
            ...prev,
            [id]: isChecked
        }));

        // 항목이 하나라도 선택된 경우 삭제 버튼을 표시
        const hasCheckedItems = Object.values({
            ...checkItem,
            [id]: isChecked
        }).some(checked => checked);

        setShowDelete(hasCheckedItems);

        // 모든 항목이 선택되지 않은 경우 전체 선택 체크박스를 해제
        if (!isChecked) {
            setAllCheck(false);
        }
    };

   const handleDelete = () => {
       const itemsToDelete = Object.keys(checkItem).filter(id => checkItem[id]);
       console.log("선택된 삭제 항목:", itemsToDelete);

       // 삭제 후 체크박스 상태 초기화
    setCheckItem(prev => {
        const newCheckItem = { ...prev };
        itemsToDelete.forEach(id => delete newCheckItem[id]);
        return newCheckItem;
    });

    // 전체 선택 체크박스 해제
    setAllCheck(false);

    // 삭제 버튼 숨기기
    setShowDelete(false);
   };

    return {
        allCheck,
        checkItem,
        showDelete,
        handleMasterCheckboxChange,
        handleCheckboxChange,
        handleDelete,
        setCheckItem,
        setAllCheck,
        setShowDelete
    };
}

export default useCheckboxManager;