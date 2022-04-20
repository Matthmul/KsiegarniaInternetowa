$(document).ready(function(){

    //Delete book AJAX
    $('.delete-book').on( "click", function(e){
        $target = $(e.target)
        const id = $target.attr('data-id');
        $.ajax({
            type:'DELETE',
            url:'/books/' + id,
            success: (response)=>{
                alert('Deleting Book');
                window.location.href = "/";
            },
            error: (err)=>{
                console.log(err)
            }
        })
    })

    //Borrow book AJAX
    $('.borrow-book').on( "click", function(e){
        $target = $(e.target)
        console.log($target)
        const id = $target.attr('data-id');
        $.ajax({
            type:'POST',
            url:'/books/' + id,
            success: (response)=>{
                alert('You borrowed the book');
                window.location.href = "/";
            },
            error: (err)=>{
                console.log(err)
            }
        })
    })
    //Return book AJAX
    $('.return-book').on( "click", function(e){
        $target = $(e.target)
        console.log($target)
        const id = $target.attr('data-id');
        $.ajax({
            type:'PUT',
            url:'/books/' + id,
            success: (response)=>{
                alert('You returned the book');
                window.location.href = "/";
            },
            error: (err)=>{
                console.log(err)
            }
        })
    })
})