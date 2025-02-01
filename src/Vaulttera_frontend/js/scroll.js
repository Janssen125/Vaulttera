$(document).ready(function () {
    // Reset scroll to the top
    function resetScroll() {
        customScroll.scrollTo(0, 0, 500);
    }

    // Apply category filter
    function applyCategoryFilter(category) {
        $('.js-scroll-list-item').each(function () {
            var itemCategory = $(this).find('p').text().toLowerCase();
            if (itemCategory.includes(category)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
        resetScroll();
        var firstVisibleItem = $('.js-scroll-list-item:visible').first();
        firstVisibleItem.addClass('item-focus');
    }

    // Search filter functionality
    $('#search').on('click', function () {
        var searchValue = $('#search-input').val().toLowerCase();
        $('.js-scroll-list-item').each(function () {
            var itemName = $(this).find('h1').text().toLowerCase();
            if (itemName.includes(searchValue)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
        resetScroll();
    });

    // Category filter functionality
    $('#search-input-a').on('click', function () {
        applyCategoryFilter('study');
    });

    $('#search-input-b').on('click', function () {
        applyCategoryFilter('game');
    });

    $('#search-input-c').on('click', function () {
        applyCategoryFilter('coding');
    });

    $('#search-input-d').on('click', function () {
        applyCategoryFilter('technology');
    });

    $('#search-input-all').on('click', function () {
        $('.js-scroll-list-item').show();
        resetScroll();
        var firstVisibleItem = $('.js-scroll-list-item:visible').first();
        firstVisibleItem.addClass('item-focus');
    });

    // Apply 'item-focus' and 'item-next' classes directly after document is ready
    console.log("Scroll.js Loaded");
    
    var firstVisibleItem = $('.js-scroll-list-item').first();
    firstVisibleItem.addClass('item-focus');
    firstVisibleItem.next().addClass('item-next');
});
