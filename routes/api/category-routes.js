const router = require('express').Router();
const { Category, Product } = require('../../models');

router.get('/', (req, res) => {

Category.findAll({
    include: [Product]
}).then (dbCategories => {
    if(dbCategories.length) {
    res.json(dbCategories);
    } else {
    res.status(404).json({message: "No categories found"});
    }
}). catch(err=>{
    console.log(err);
    res.status(500).json({message: "an error occurred", err:err});
    })
});

router.get('/:id', (req, res) => {
    Category.findOne({
    include:[Product],
    where: {
    id:req.params.id
    }
}).then(foundCategoryById => {
    if(!foundCategoryById) {
    res.status(401).json({message:"incorrect id"});
    } else {
    res.json(foundCategoryById);
    }
})
});

router.post('/', (req, res) => {
    Category.create({
    id:req.body.id,
    category_name:req.body.category_name
}).then(newCategory => {
    res.json(newCategory);
}).catch(err => {
    console.log(err);
    res.status(500),json({message:"an error occurred"})
})
});

router.put('/:id', (req, res) => {
    Category.update({
    category_name:req.body.category_name
},
{
    where: {
        id:req.params.id
    },
}
).then((updateCategory) => {
    res.json(updateCategory);
}).catch((err) => {
    console.log(err);
    res.json(err);
})
});

router.delete('/:id', (req, res) => {
    Category.destroy({
    where:{
    id:req.params.id
    }
}).then(deleteCategory => {
    res.json(deleteCategory)
})
});

module.exports = router;