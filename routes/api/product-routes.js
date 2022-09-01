const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

router.get('/', (req, res) => {
console.log("request")
Product.findAll({

include: [
    Category,
    {
    model: Tag,
    through: ProductTag
    }
]
}).then (dbProduct => {
    res.json(dbProduct);
}). catch(err=>{
console.log(err);
res.status(500).json({message: "an error occurred", err:err});
})
});

router.get('/:id', (req, res) => {
Product.findOne({
where: {
    id:req.params.id
},
include: [
    Category,
    {
    model: Tag,
    through: ProductTag
    }
]
}).then(foundProductById => {
if(!foundProductById) {
    res.status(401).json({message:"incorrect id"});
} else {
    res.json(foundProductById);
}
})
});
router.post('/', (req, res) => {

Product.create(req.body)
    .then((product) => {
    if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
            product_id: product.id,
            tag_id,
        };
        });
        return ProductTag.bulkCreate(productTagIdArr);
    }
    res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
    console.log(err);
    res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
console.log(req.body);
Product.update(
    req.body,
{
    where: {
    id: req.params.id,
    },
}).then((product) => {
    return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
    const productTagIds = productTags.map(({ tag_id }) => tag_id);
    const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
        return {
            product_id: req.params.id,
            tag_id,
        };
        });
    const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

    return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
    ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
    res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
Product.destroy({
    where: {
    id: req.params.id,
    },
})
    .then((deletedProduct) => {
    res.json(deletedProduct);
    })
    .catch((err) => res.json(err));
});

module.exports = router;