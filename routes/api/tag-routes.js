const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

router.get('/', (req, res) => {
Tag.findAll({
include: [{
    model: Product,
    through:ProductTag,
}]  
}).then (dbTags => {
    res.status(200).json(dbTags);
}). catch(err=>{
    console.log(err);
    res.status(500).json({message: "an error occurred", err:err});
  })
});
router.get('/:id', (req, res) => {
Tag.findOne({

where: {
    id:req.params.id
},
include: [{
    model:Product,
    through:ProductTag
}], 
}).then(foundTagById => {
if(!foundTagById) {
    res.status(401).json({message:"incorrect id"});
} else {
    res.json(foundTagById);
}
})
});
router.post('/', (req, res) => {
Tag.create(
    req.body
).then(newTag => {
    res.json(newTag);
}).catch(err => {
    console.log(err);
    res.status(500),json({message:"an error occurred"})
})
});

router.put('/:id', (req, res) => {
Tag.update({
    tag_name:req.body.tag_name
},
{
    where: {
    id:req.params.id
    },
}
).then((updatedProductTags) => {
    res.json(updatedProductTags);
}).catch((err) => {
    console.log(err);
    res.json(err);
  })
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
Tag.destroy({
    where:{
    id:req.params.id
    }
}).then(deleteTag => {
    res.json(deleteTag)
})
});


module.exports = router;