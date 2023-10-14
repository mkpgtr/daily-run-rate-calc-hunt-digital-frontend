export function paginate(items, currentPage, itemsPerPage) {
    // Calculate the total number of pages
    const totalNumberOfPages = Math.ceil(items?.length / itemsPerPage);
  
    // Calculate the starting and ending indices for the current page
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
  
    // Get the items for the current page
    const itemsForCurrentPage = items?.slice(startIdx, endIdx);
  
    return {
      totalNumberOfPages,
      itemsForCurrentPage,
    };
  }

export  function createArray(n) {
    console.log(n)
    return [...Array(n).keys()].map((x) => x + 1);
  }